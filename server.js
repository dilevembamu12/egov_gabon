// --- Imports ---
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import http from 'http'; // Importé pour WebSocket
import { WebSocketServer, WebSocket } from 'ws'; // Importé pour WebSocket
import mysql from 'mysql2/promise'; // Importé pour l'ancien projet

// --- Imports de nos modules ---
import db from './models/index.js'; // Base de données Sequelize (Nouveau Projet)
import { servicesData } from './data/services.js'; // Fichier de services (Ancien Projet)
import { runPenaltyJob } from './services/penaltyService.js'; // Service de pénalités (Nouveau Projet)

// --- Configuration de base ---
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = http.createServer(app);
const wss = new WebSocketServer({ server }); // WebSocket attaché au serveur principal

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Mettre à true en production (HTTPS)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

// "locals" pour rendre les données de session disponibles dans toutes les vues
app.use((req, res, next) => {
    res.locals.userAdmin = req.session.userAdmin;
    res.locals.userCitizen = req.session.userCitizen;
    next();
});

// --- CONNEXIONS AUX BASES DE DONNÉES ---

// 1. Connexion Sequelize (Nouveau Projet - Infractions)
// (db.sequelize.authenticate() est appelé dans startServer)

// 2. Connexion mysql2 (Ancien Projet - Formulaires Publics)
// Initialisé "à la volée" pour le dashboard public et la soumission
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // Utilise la même BDD
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- GESTION DES WEBSOCKETS (Ancien Projet - Dashboard Public) ---
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

// ==========================================================
// == ROUTES DU PORTAIL PUBLIC (Ancien Projet)
// ==========================================================

// 1. Page d'atterrissage (Landing Page)
app.get('/', (req, res) => {
    // Métadonnées pour chaque catégorie (titre, icône, couleur, etc.)
    const categories = {
        etat_civil_citoyennete: { title: 'État Civil & Citoyenneté', icon: 'fa-users', color: 'green', desc: 'Passeport, CNI, état civil...' },
        transports_mobilite: { title: 'Transports & Mobilité', icon: 'fa-car', color: 'blue', desc: 'Infractions, carte grise, permis...' },
        entreprises_emploi: { title: 'Entreprises & Emploi', icon: 'fa-briefcase', color: 'purple', desc: 'Création d\'entreprise, NIF...' },
        impots_finances: { title: 'Impôts & Finances', icon: 'fa-file-invoice-dollar', color: 'indigo', desc: 'Quitus fiscal, déclaration...' },
        foncier_urbanisme: { title: 'Foncier & Urbanisme', icon: 'fa-home', color: 'orange', desc: 'Permis de construire...' },
        justice_legalite: { title: 'Justice & Légalité', icon: 'fa-gavel', color: 'slate', desc: 'Casier judiciaire...' },
        sante_protection_sociale: { title: 'Santé & Protection Sociale', icon: 'fa-heartbeat', color: 'red', desc: 'Rendez-vous médicaux...' },
        education_formation: { title: 'Éducation & Formation', icon: 'fa-graduation-cap', color: 'teal', desc: 'Bourses, inscriptions...' },
        douanes_commerce: { title: 'Douanes & Commerce', icon: 'fa-ship', color: 'gray', desc: 'Déclaration douanière...' },
        tourisme_artisanat: { title: 'Tourisme & Artisanat', icon: 'fa-plane-departure', color: 'cyan', desc: 'E-Visa, licences...' }
    };
    res.render('landing', { 
        title: 'e-Gouv Gabon - Accueil',
        categories: categories,
        servicesData: servicesData // Transmis au script JS de la page
    });
});

// 2. Tableau de bord des soumissions publiques (Ancien Projet)
app.get('/dashboard', async (req, res) => {
    let connection;
    try {
        connection = await dbPool.getConnection(); // Utilise la connexion mysql2
        const query = 'SELECT * FROM form_submissions ORDER BY created_at DESC';
        const [submissions] = await connection.execute(query);
        const parsedSubmissions = submissions.map(sub => {
            try {
                return { ...sub, form_json: typeof sub.form_json === 'string' ? JSON.parse(sub.form_json) : sub.form_json };
            } catch (e) {
                return { ...sub, form_json: { "Erreur": "Format JSON invalide" } };
            }
        });
        res.render('dashboard', { // Rend 'views/dashboard.ejs'
            title: 'Dashboard - Suivi des Soumissions Publiques',
            submissions: parsedSubmissions
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        res.status(500).send("<h1>Erreur Serveur</h1>");
    } finally {
        if (connection) connection.release();
    }
});

// 3. Affichage d'un formulaire web dynamique (Ancien Projet)
app.get('/form/:serviceKey', (req, res) => {
    const { serviceKey } = req.params;
    const service = servicesData[serviceKey];
    if (service && service.form) {
        res.render('form', { service: service.form });
    } else {
        res.status(404).send("<h1>404 - Service non trouvé</h1>");
    }
});

// 4. Soumission d'un formulaire web (Ancien Projet - Logique Corrigée)
app.post('/api/submissions', async (req, res) => {
    const submissionData = req.body;
    if (!submissionData.service_title || !submissionData.form_json) {
        return res.status(400).json({ success: false, message: 'service_title et form_json sont requis.' });
    }
    const phoneNumber = 'Web Form';
    const name = 'Utilisateur Web';
    
    // Essayer de trouver la catégorie correspondante
    let service_categorie = 'Non défini';
    const serviceKey = Object.keys(servicesData).find(key => servicesData[key].form.title === submissionData.service_title);
    if(serviceKey) {
        service_categorie = servicesData[serviceKey].categoryKey;
    }
    
    let finalId;
    let isNewEntry = false;

    try {
        const insertSql = `INSERT INTO form_submissions (service_categorie, service_title, wa_phoneNumber, wa_name, form_json, status) VALUES (?, ?, ?, ?, ?, ?)`;
        const insertParams = [
            service_categorie,
            submissionData.service_title,
            phoneNumber,
            name,
            JSON.stringify(submissionData.form_json),
            'finalise' // Statut par défaut pour les formulaires web
        ];
        
        const [result] = await dbPool.execute(insertSql, insertParams); // Utilise la connexion mysql2
        finalId = result.insertId;
        isNewEntry = true;

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('Doublon détecté (soumission publique). Récupération de l\'ID existant...');
            const selectSql = `SELECT id FROM form_submissions WHERE service_categorie = ? AND service_title = ? AND wa_phoneNumber = ?`;
            const selectParams = [service_categorie, submissionData.service_title, phoneNumber];
            const [rows] = await dbPool.execute(selectSql, selectParams);
            if (rows.length > 0) {
                finalId = rows[0].id;
            } else {
                throw new Error('Impossible de récupérer l\'ID du doublon.');
            }
        } else {
            console.error("Erreur lors de la soumission du formulaire :", error);
            return res.status(500).json({ success: false, message: 'Erreur de base de données.' });
        }
    }

    try {
        if (finalId && isNewEntry) {
            const [rows] = await dbPool.execute('SELECT * FROM form_submissions WHERE id = ?', [finalId]);
            if (rows[0]) {
                broadcastNewSubmission(rows[0]); // Diffuse au WebSocket
            }
        }
        res.status(201).json({ success: true, id: finalId, is_new: isNewEntry });
    } catch (broadcastError) {
         console.error("Erreur lors de la diffusion WebSocket :", broadcastError);
         res.status(201).json({ success: true, id: finalId, is_new: isNewEntry, warning: 'Erreur de diffusion WebSocket.' });
    }
});

// 5. Route de synchronisation (Ancien Projet)
app.post('/api/sync/:id', async (req, res) => {
    const { id } = req.params;
    const syncDate = new Date();
    let connection;
    try {
        connection = await dbPool.getConnection(); // Utilise la connexion mysql2
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


// 6. Générateur de System Prompt (Ancien Projet)
app.get('/api/system-prompt', (req, res) => {
    try {
        const promptHeader = `# SYSTEM PROMPT - Assistant Virtuel eGouv Gabon
## 1. Rôle et Objectif
Tu es un assistant IA expert, patient et extrêmement précis, spécialisé dans l'accompagnement des citoyens pour les démarches administratives du Gabon (eGouv). Ton unique objectif est d'aider l'utilisateur à remplir le formulaire du service qu'il a choisi, en posant une série de questions claires et en validant chaque réponse. Tu te comportes comme un agent administratif numérique : courtois, efficace et sécurisé.

## 2. Contexte
Tu es intégré dans une interface de chatbot sur la plateforme eGouv. L'utilisateur a déjà cliqué sur un service spécifique ou va te dire lequel il souhaite utiliser. Tu ne dois discuter d'aucun autre sujet. Ta mission commence par l'identification du service et se termine par la confirmation que le formulaire est entièrement et correctement rempli.
Si l'utilisateur n'indique pas clairement un service, demande-lui de choisir parmi les services disponibles que tu listeras (basés sur les masques ci-dessous). Utilise un système de choix numéroté pour faciliter la sélection.

## 3. Comportement et Règles Fondamentales

### 3.1. Démarrage de la Conversation
- Si le service n'est pas déjà connu, identifie-le à partir du message de l'utilisateur ou demande-lui de choisir dans la liste.
- Une fois le service choisi, annonce le début du processus.
  - **Exemple :** "Parfait. Nous allons commencer la procédure pour le **Renouvellement de votre Carte Grise**. Je vais vous poser une série de questions pour remplir le formulaire."

### 3.2. Déroulement du Formulaire (Jeu de Questions-Réponses)
- **Une question à la fois :** Pose une seule question à la fois, en suivant l'ordre exact des champs définis dans le masque du formulaire correspondant.
- **Affichage de la Progression :** Avant CHAQUE question, indique la progression. Calcule le nombre total de questions **obligatoires** (\`total_obligatoire\`) et affiche le statut.
  - **Format obligatoire :** \`(Question X sur Y) - Progression : Z%\`
  - \`X\` est le numéro de la question actuelle (basé sur l'index du champ + 1).
  - \`Y\` est le nombre total de questions obligatoires.
  - \`Z\` est le pourcentage d'avancement ( \`(X-1) / Y * 100\`, arrondi à l'entier).
- **Champs Optionnels :** Si une question correspond à un champ optionnel (\`"required": false\`), précise-le clairement.
  - **Exemple :** "(Cette information est optionnelle) Souhaitez-vous ajouter une adresse e-mail ?"

### 3.3. Validation Stricte des Données
- Pour chaque réponse, valide-la selon les critères (\`type\`, \`validation_regex\`) du masque.
- **Succès :** Passe à la question suivante.
- **Erreur :**
    1. Informe l'utilisateur de l'erreur.
    2. Explique pourquoi (format, longueur, etc.).
    3. Donne l'exemple clair (\`exemple\`) fourni.
    4. Repose la même question.
  - **Exemple :** "Désolé, le format du numéro de téléphone semble incorrect. Il doit commencer par 061, 062, 065, 066, 074 ou 077 et contenir 8 chiffres. **Par exemple : \`077123456\`**. Pouvez-vous redonner votre numéro ?"

### 3.4. Fin du Formulaire
- Quand la dernière question obligatoire est répondue, annonce la fin.
- Présente un résumé structuré de **toutes** les informations collectées.
- Demande une confirmation finale.
  - **Exemple :** "Terminé ! Résumé : \n - **Plaque :** \`AB-123-CD\`\n - **VIN :** \`VF1...\`\n Est-ce correct ?"
- Si l'utilisateur confirme, appelle l'outil \`insert_new_formSubmission\` pour enregistrer, puis informe l'utilisateur de la suite.

### 3.5. Formatage
- Utilise un formatage simple et lisible pour WhatsApp (gras, retours à la ligne).

---

## 4. Masques de Formulaires des Services

**NOTE :** Utilise IMPÉRATIVEMENT la structure ci-dessous.
`;
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


// ==========================================================
// == ROUTES DE L'APPLICATION MÉTIER (Nouveau Projet - Sequelize)
// ==========================================================

// --- Middlewares d'Authentification ---
const isAdmin = (req, res, next) => {
    if (req.session && req.session.userAdmin) {
        res.locals.userAdmin = req.session.userAdmin;
        return next();
    }
    res.redirect('/admin/login');
};
const hasRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.session.userAdmin.role)) {
            return res.status(403).render('admin/access_denied', { 
                title: 'Accès Refusé', 
                message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.'
            });
        }
        return next();
    };
};
const isCitizen = (req, res, next) => {
    if (req.session && req.session.userCitizen) {
        res.locals.userCitizen = req.session.userCitizen;
        return next();
    }
    res.redirect('/login');
};

// --- Routes Espace Citoyen (Infractions) ---
app.get('/login', (req, res) => {
    if (req.session && req.session.userCitizen) return res.redirect('/citizen/dashboard');
    res.render('citizen/login', { error: null, title: 'Connexion Citoyen' });
});

app.post('/login', async (req, res) => {
    const { cni, password } = req.body;
    try {
        const user = await db.UserCitizen.findOne({ where: { cni: cni } });
        if (!user || !user.validPassword(password)) {
            return res.render('citizen/login', { error: 'N° CNI ou mot de passe incorrect.', title: 'Connexion Citoyen' });
        }
        req.session.userCitizen = { id: user.id, nom_complet: user.nom_complet, cni: user.cni };
        res.redirect('/citizen/dashboard');
    } catch (error) {
        res.render('citizen/login', { error: 'Une erreur est survenue.', title: 'Connexion Citoyen' });
    }
});

app.get('/citizen/dashboard', isCitizen, async (req, res) => {
    try {
        const infractions = await db.Infraction.findAll({
            where: { citoyenId: req.session.userCitizen.id },
            include: [{ model: db.InfractionType, as: 'type' }],
            order: [['date_emission', 'DESC']]
        });
        let total_a_payer = 0;
        let total_paye = 0;
        infractions.forEach(inf => {
            if (inf.statut === 'en_attente' || inf.statut === 'en_retard') {
                total_a_payer += parseFloat(inf.montant_actuel);
            } else if (inf.statut === 'payee') {
                total_paye += parseFloat(inf.montant_actuel);
            }
        });
        res.render('citizen/dashboard', {
            title: 'Mon Espace - eGouv Gabon',
            infractions: infractions,
            total_a_payer: total_a_payer,
            total_paye: total_paye
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de vos infractions.');
    }
});

app.get('/citizen/pay/:infractionId', isCitizen, async (req, res) => {
    try {
        const infraction = await db.Infraction.findOne({
            where: { 
                id: req.params.infractionId,
                citoyenId: req.session.userCitizen.id
            },
            include: [{ model: db.InfractionType, as: 'type' }]
        });
        if (!infraction) {
            return res.status(404).send('Infraction non trouvée.');
        }
        if (infraction.statut === 'payee') {
            return res.render('citizen/payment_status', {
                title: 'Paiement déjà effectué',
                success: true,
                message: 'Cette infraction a déjà été payée.'
            });
        }
        res.render('citizen/payment_gateway', { 
            title: 'Finaliser le Paiement',
            infraction: infraction 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur.');
    }
});

// --- Routes Espace Admin (Infractions) ---
app.get('/admin/login', (req, res) => {
    if (req.session && req.session.userAdmin) return res.redirect('/admin/dashboard');
    res.render('admin/login', { error: null, title: 'Connexion Admin' });
});

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.UserAdmin.findOne({ where: { username: username } });
        if (!user || !user.validPassword(password)) {
            return res.render('admin/login', { error: 'Nom d\'utilisateur ou mot de passe incorrect.', title: 'Connexion Admin' });
        }
        req.session.userAdmin = { id: user.id, username: user.username, role: user.role };
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.render('admin/login', { error: 'Une erreur est survenue.', title: 'Connexion Admin' });
    }
});

app.get('/admin/dashboard', isAdmin, (req, res) => {
    res.render('admin/dashboard', { title: 'Tableau de Bord Admin' });
});

app.get('/admin/infraction/new', isAdmin, hasRole(['agent_verbalisateur', 'administrateur']), async (req, res) => {
    try {
        const infractionTypes = await db.InfractionType.findAll();
        res.render('admin/new_infraction', { 
            title: 'Nouvelle Infraction',
            infractionTypes: infractionTypes,
            success: null,
            error: null 
        });
    } catch (error) {
        console.error(error);
        res.render('admin/new_infraction', { 
            title: 'Nouvelle Infraction',
            infractionTypes: [],
            success: null,
            error: 'Erreur lors du chargement des types d\'infraction.' 
        });
    }
});

app.post('/admin/infraction/new', isAdmin, hasRole(['agent_verbalisateur', 'administrateur']), async (req, res) => {
    const { plaque, cni_citoyen, infractionTypeId, proces_verbal, photos_url } = req.body;
    const agentId = req.session.userAdmin.id;
    let infractionTypes;
    try {
        infractionTypes = await db.InfractionType.findAll();
        const citoyen = await db.UserCitizen.findOne({ where: { cni: cni_citoyen } });
        if (!citoyen) {
            throw new Error(`Aucun citoyen trouvé avec le N° CNI : ${cni_citoyen}`);
        }
        const type = await db.InfractionType.findByPk(infractionTypeId);
        if (!type) {
            throw new Error('Type d\'infraction invalide.');
        }
        const date_emission = new Date();
        const date_limite_paiement = new Date();
        date_limite_paiement.setDate(date_emission.getDate() + type.delai_paiement_jours);
        await db.Infraction.create({
            plaque_immatriculation: plaque,
            statut: 'en_attente',
            montant_actuel: type.montant_base,
            date_emission: date_emission,
            date_limite_paiement: date_limite_paiement,
            proces_verbal: proces_verbal || null,
            photos_url: photos_url ? [photos_url] : null,
            agentId: agentId,
            citoyenId: citoyen.id,
            infractionTypeId: type.id
        });
        res.render('admin/new_infraction', { 
            title: 'Nouvelle Infraction',
            infractionTypes: infractionTypes,
            success: `Infraction enregistrée avec succès pour la plaque ${plaque} (Citoyen: ${citoyen.nom_complet}).`,
            error: null 
        });
    } catch (error) {
        console.error("Erreur lors de la création de l'infraction:", error);
        res.render('admin/new_infraction', { 
            title: 'Nouvelle Infraction',
            infractionTypes: infractionTypes || [],
            success: null,
            error: error.message 
        });
    }
});

// API pour la vérification de CNI (utilisée par le scanner QR)
app.post('/api/citizen/check-cni', isAdmin, hasRole(['agent_verbalisateur', 'administrateur']), async (req, res) => {
    const { cni } = req.body;
    if (!cni) {
        return res.status(400).json({ success: false, message: "Le N° CNI est manquant." });
    }
    try {
        const citoyen = await db.UserCitizen.findOne({ where: { cni: cni } });
        if (citoyen) {
            res.json({ success: true, citoyen: { nom_complet: citoyen.nom_complet, cni: citoyen.cni } });
        } else {
            res.status(404).json({ success: false, message: "Aucun citoyen trouvé avec ce N° CNI." });
        }
    } catch (error) {
        console.error("Erreur API /check-cni:", error);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
});

app.get('/admin/infractions', isAdmin, hasRole(['agent_controle', 'administrateur']), async (req, res) => {
    try {
        const infractions = await db.Infraction.findAll({
            include: [
                { model: db.InfractionType, as: 'type' },
                { model: db.UserAdmin, as: 'agentVerbalisateur', attributes: ['username'] },
                { model: db.UserCitizen, as: 'citoyenConcerne', attributes: ['nom_complet', 'cni'] }
            ],
            order: [['date_emission', 'DESC']]
        });
        res.render('admin/infractions', { title: 'Suivi des Infractions', infractions: infractions });
    } catch (error) {
        console.error("Erreur lors de la récupération de toutes les infractions:", error);
        res.status(500).send("Erreur serveur.");
    }
});

app.get('/admin/penalties', isAdmin, hasRole(['administrateur']), async (req, res) => {
    try {
        const rules = await db.PenaltyRule.findAll({ order: [['jours_apres_delai', 'ASC']] });
        res.render('admin/penalties', { title: 'Gestion des Pénalités', rules: rules });
    } catch (error) {
         console.error("Erreur lors de la récupération des règles:", error);
        res.status(500).send("Erreur serveur.");
    }
});

// Webhook de paiement (Simulation)
app.post('/api/payment/webhook', async (req, res) => {
    const { infractionId, methode } = req.body;
    try {
        const infraction = await db.Infraction.findByPk(infractionId);
        if (!infraction) {
            return res.status(404).json({ success: false, message: "Infraction non trouvée" });
        }
        
        // Créer un enregistrement de paiement
        await db.Payment.create({
            montant: infraction.montant_actuel,
            methode: methode,
            reference_paiement: `SIM-${Date.now()}`,
            statut: 'reussi',
            infractionId: infraction.id
        });

        // Mettre à jour l'infraction
        infraction.statut = 'payee';
        await infraction.save();

        res.json({ success: true, message: "Paiement enregistré" });
    } catch (error) {
        console.error("Erreur Webhook Paiement:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
});

// --- Route de Déconnexion Globale ---
app.get('/logout', (req, res) => {
    const isAdmin = req.session.userAdmin;
    req.session.destroy((err) => {
        res.clearCookie('connect.sid');
        if (isAdmin) {
            res.redirect('/admin/login');
        } else {
            res.redirect('/login');
        }
    });
});

// ===================================
// DÉMARRAGE DU SERVEUR
// ===================================
async function startServer() {
    try {
        await db.sequelize.authenticate(); 
        console.log('✅ [Sequelize] Connexion à la base de données réussie.');
        
        // Teste la connexion mysql2
        const connection = await dbPool.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        console.log('✅ [MySQL2] Connexion au pool de base de données réussie.');

        server.listen(PORT, () => {
            console.log(`🚀 Serveur web et WebSocket démarrés sur http://localhost:${PORT}`);
            console.log(`➡️  Portail Public : http://localhost:${PORT}`);
            console.log(`➡️  Espace Citoyen : http://localhost:${PORT}/login`);
            console.log(`➡️  Espace Admin   : http://localhost:${PORT}/admin/login`);
            console.log(`➡️  Dashboard Public : http://localhost:${PORT}/dashboard`);
        });

        // Lancer la tâche planifiée
        console.log("⏰ Tâche planifiée (pénalités) démarrée. S'exécute toutes les 24h.");
        runPenaltyJob();
    } catch (error) {
        console.error('❌ Impossible de démarrer le serveur:', error);
    }
}

startServer();