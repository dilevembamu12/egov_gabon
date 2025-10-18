// Importer les modules nécessaires
import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { servicesData } from './data/services.js'; // NOUVELLE IMPORTATION

// Configuration de base pour Express
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la connexion à la base de données
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- GESTION DES WEBSOCKETS (pour le dashboard) ---
wss.on('connection', (ws) => {
    console.log('✅ Client WebSocket connecté au tableau de bord.');
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
    ws.on('close', () => console.log('❌ Client WebSocket déconnecté.'));
});

const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on('close', () => { clearInterval(interval); });

function broadcastNewSubmission(submission) {
    const data = JSON.stringify(submission);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// =====================================================
// ==                  ROUTES DE L'APPLICATION        ==
// =====================================================

// --- NOUVELLE ROUTE : Page d'atterrissage (Landing Page) ---
app.get('/', (req, res) => {
    // Métadonnées pour chaque catégorie (titre, icône, couleur, etc.)
    const categories = {
        etat_civil_citoyennete: { title: 'État Civil & Citoyenneté', icon: 'fa-users', color: 'green', desc: 'Passeport, CNI, état civil...' },
        transports_mobilite: { title: 'Transports & Mobilité', icon: 'fa-car', color: 'blue', desc: 'Carte grise, permis, vignette...' },
        entreprises_emploi: { title: 'Entreprises & Emploi', icon: 'fa-briefcase', color: 'purple', desc: 'Création d\'entreprise, NIF...' },
        impots_finances: { title: 'Impôts & Finances', icon: 'fa-file-invoice-dollar', color: 'indigo', desc: 'Quitus fiscal, déclaration...' },
        foncier_urbanisme: { title: 'Foncier & Urbanisme', icon: 'fa-home', color: 'orange', desc: 'Permis de construire...' },
        justice_legalite: { title: 'Justice & Légalité', icon: 'fa-gavel', color: 'slate', desc: 'Casier judiciaire...' },
        sante_protection_sociale: { title: 'Santé & Protection Sociale', icon: 'fa-heartbeat', color: 'red', desc: 'Rendez-vous médicaux...' },
        education_formation: { title: 'Éducation & Formation', icon: 'fa-graduation-cap', color: 'teal', desc: 'Bourses, inscriptions...' },
        douanes_commerce: { title: 'Douanes & Commerce', icon: 'fa-ship', color: 'gray', desc: 'Déclaration douanière...' },
        tourisme_artisanat: { title: 'Tourisme & Artisanat', icon: 'fa-plane-departure', color: 'cyan', desc: 'E-Visa, licences...' }
    };

    // Passer les catégories et les données de service brutes au template EJS
    res.render('landing', { 
        title: 'e-Gouv Gabon - Accueil',
        categories: categories,
        servicesData: servicesData // Pour le script côté client
    });
});

// --- ROUTE MODIFIÉE : Tableau de bord (Dashboard) ---
app.get('/dashboard', async (req, res) => {
    let connection;
    try {
        connection = await dbPool.getConnection();
        const query = 'SELECT * FROM form_submissions ORDER BY created_at DESC';
        const [submissions] = await connection.execute(query);
        const parsedSubmissions = submissions.map(sub => {
            try {
                return { ...sub, form_json: typeof sub.form_json === 'string' ? JSON.parse(sub.form_json) : sub.form_json };
            } catch (e) {
                return { ...sub, form_json: { "Erreur": "Format JSON invalide" } };
            }
        });
        res.render('dashboard', {
            title: 'Dashboard - Suivi des Soumissions eGouv',
            submissions: parsedSubmissions
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        res.status(500).send("<h1>Erreur Serveur</h1>");
    } finally {
        if (connection) connection.release();
    }
});

// --- NOUVELLE ROUTE : Affichage d'un formulaire web dynamique ---
app.get('/form/:serviceKey', (req, res) => {
    const { serviceKey } = req.params;
    const service = servicesData[serviceKey];

    if (service && service.form) {
        res.render('form', {
            service: service.form
        });
    } else {
        res.status(404).send("<h1>404 - Service non trouvé</h1><p>Le formulaire pour ce service n'existe pas.</p>");
    }
});

// --- ROUTES API (inchangées) ---
app.post('/api/submissions', async (req, res) => {
    const submissionData = req.body;

    // 1. Validation des données entrantes
    if (!submissionData.service_title || !submissionData.form_json) {
        return res.status(400).json({ success: false, message: 'service_title et form_json sont requis.' });
    }
    
    // 2. Déterminer la source et préparer les données
    const isWhatsApp = submissionData.wa_phoneNumber && submissionData.wa_name;
    const phoneNumber = isWhatsApp ? submissionData.wa_phoneNumber : 'Web Form';
    const name = isWhatsApp ? submissionData.wa_name : 'Utilisateur Web';
    const service_categorie = submissionData.service_categorie || 'Ministère des Transports'; // Catégorie par défaut
    
    let finalId;
    let isNewEntry = false;

    // 3. Logique "Trouver ou Créer" robuste
    try {
        const insertSql = `INSERT INTO form_submissions (service_categorie, service_title, wa_phoneNumber, wa_name, form_json, status) VALUES (?, ?, ?, ?, ?, ?)`;
        const insertParams = [
            service_categorie,
            submissionData.service_title,
            phoneNumber,
            name,
            JSON.stringify(submissionData.form_json),
            submissionData.status || 'finalise'
        ];
        
        const [result] = await dbPool.execute(insertSql, insertParams);
        finalId = result.insertId;
        isNewEntry = true; // C'est une nouvelle entrée

    } catch (error) {
        // Gérer l'erreur de doublon
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('Doublon détecté. Récupération de l\'ID existant...');
            const selectSql = `SELECT id FROM form_submissions WHERE service_categorie = ? AND service_title = ? AND wa_phoneNumber = ?`;
            const selectParams = [service_categorie, submissionData.service_title, phoneNumber];
            const [rows] = await dbPool.execute(selectSql, selectParams);
            if (rows.length > 0) {
                finalId = rows[0].id;
            } else {
                // Ce cas est peu probable mais géré par sécurité
                throw new Error('Impossible de récupérer l\'ID du doublon.');
            }
        } else {
            // Gérer les autres erreurs de base de données
            console.error("Erreur lors de la soumission du formulaire :", error);
            return res.status(500).json({ success: false, message: 'Erreur de base de données.' });
        }
    }

    // 4. Diffuser au WebSocket et répondre
    try {
        if (finalId && isNewEntry) {
            const [rows] = await dbPool.execute('SELECT * FROM form_submissions WHERE id = ?', [finalId]);
            if (rows[0]) {
                broadcastNewSubmission(rows[0]);
            }
        }
        res.status(201).json({ success: true, id: finalId, is_new: isNewEntry });
    } catch (broadcastError) {
         console.error("Erreur lors de la diffusion WebSocket :", broadcastError);
         // On renvoie quand même une réponse positive car l'insertion a réussi
         res.status(201).json({ success: true, id: finalId, is_new: isNewEntry, warning: 'Erreur de diffusion WebSocket.' });
    }
});


app.post('/api/sync/:id', async (req, res) => {
    const { id } = req.params;
    const syncDate = new Date();
    let connection;
    try {
        connection = await dbPool.getConnection();
        const query = 'UPDATE form_submissions SET synchronized_at = ? WHERE id = ?';
        const [result] = await connection.execute(query, [syncDate, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Soumission non trouvée.' });
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        res.json({ success: true, synchronized_at: syncDate.toISOString() });
    } catch (error) {
        console.error(`Erreur de synchronisation pour l'ID ${id}:`, error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    } finally {
        if (connection) connection.release();
    }
});



// --- NOUVEL ENDPOINT : Génération du System Prompt ---
app.get('/api/system-prompt', (req, res) => {
    try {
        // Partie statique du prompt
        const promptHeader = ``;

        // Partie dynamique : Génération des masques
        // Étape 1: Regrouper les services par catégorie
        const groupedServices = {};
        for (const key in servicesData) {
            const service = servicesData[key];
            if (!service.form) continue;
            const categoryKey = service.categoryKey;
            if (!groupedServices[categoryKey]) {
                groupedServices[categoryKey] = [];
            }
            groupedServices[categoryKey].push(service);
        }
        
        // Étape 2: Définir les titres lisibles pour les catégories
        const categoryTitles = {
            etat_civil_citoyennete: 'État Civil & Citoyenneté',
            transports_mobilite: 'Transports & Mobilité',
            entreprises_emploi: 'Entreprises & Emploi',
            impots_finances: 'Impôts & Finances',
            foncier_urbanisme: 'Foncier & Urbanisme',
            justice_legalite: 'Justice & Légalité',
            sante_protection_sociale: 'Santé & Protection Sociale',
            education_formation: 'Éducation & Formation',
            douanes_commerce: 'Douanes & Commerce',
            tourisme_artisanat: 'Tourisme & Artisanat'
        };

        // Étape 3: Générer la chaîne de caractères pour les masques
        let serviceMasksString = '';
        for (const categoryKey in groupedServices) {
            const categoryTitle = categoryTitles[categoryKey] || categoryKey.replace(/_/g, ' ').toUpperCase();
            serviceMasksString += `\n## Categorie service : ${categoryTitle}\n`;

            const servicesInCategory = groupedServices[categoryKey];
            servicesInCategory.forEach(service => {
                const totalObligatoire = service.form.fields.filter(f => f.required).length;
                serviceMasksString += `### Service: ${service.form.title}\n`;
                serviceMasksString += `- **total_obligatoire**: ${totalObligatoire}\n`;
                serviceMasksString += `- **champs**:\n`;

                service.form.fields.forEach((field, index) => {
                    serviceMasksString += `    ${index + 1}. \`label\`: "${field.label.replace(/"/g, '\\"')}", \`type\`: "${field.type}", \`required\`: ${field.required}`;
                    if (field.pattern) serviceMasksString += `, \`validation_regex\`: "${field.pattern.replace(/"/g, '\\"')}"`;
                    if (field.exemple) serviceMasksString += `, \`exemple\`: "${field.exemple.replace(/"/g, '\\"')}"`;
                    if (field.options && field.options.length > 0) serviceMasksString += `, \`options\`: ["${field.options.join('", "')}"]`;
                    serviceMasksString += '\n';
                });
                serviceMasksString += '\n';
            });
        }

        const fullSystemPrompt = promptHeader + serviceMasksString;

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(fullSystemPrompt);

    } catch (error) {
        console.error("Erreur lors de la génération du System Prompt:", error);
        res.status(500).send("Erreur serveur lors de la génération du prompt.");
    }
});

// Démarrer le serveur HTTP unifié
server.listen(PORT, () => {
    console.log(`🚀 Serveur web démarré sur http://localhost:${PORT}`);
    console.log(`➡️  Page d'accueil : http://localhost:${PORT}`);
    console.log(`➡️  System Prompt  : http://localhost:${PORT}/api/system-prompt`); // NOUVEAU
});
