// Importer les modules nécessaires
import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http'; // Module natif de Node.js
import { WebSocketServer } from 'ws'; // Nouvelle importation

// Configuration de base pour Express
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Créer un serveur HTTP traditionnel qui utilise notre application Express
const server = http.createServer(app);

// Créer une instance de WebSocketServer et l'attacher à notre serveur HTTP
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

// Gérer les connexions WebSocket (inchangé)
wss.on('connection', (ws) => {
    console.log('✅ Client WebSocket connecté au tableau de bord.');
    ws.on('close', () => console.log('❌ Client WebSocket déconnecté.'));
});

// Fonction pour diffuser une nouvelle soumission (inchangée)
function broadcastNewSubmission(submission) {
    const data = JSON.stringify(submission);
    wss.clients.forEach((client) => {
        if (client.readyState === 1) { // 1 = WebSocket.OPEN
            client.send(data);
        }
    });
}




// Route principale pour afficher la liste des formulaires
app.get('/', async (req, res) => {
    let connection;
    try {
        connection = await dbPool.getConnection();
        const query = 'SELECT * FROM form_submissions ORDER BY created_at DESC';
        const [submissions] = await connection.execute(query);

        // --- CORRECTIF PRINCIPAL ---
        // On s'assure que la colonne `form_json` est bien un objet JavaScript
        // avant de l'envoyer à la vue.
        const parsedSubmissions = submissions.map(sub => {
            try {
                // Si form_json est une chaîne, on la parse. Sinon, on la laisse telle quelle.
                if (typeof sub.form_json === 'string') {
                    return { ...sub, form_json: JSON.parse(sub.form_json) };
                }
                return sub;
            } catch (e) {
                console.error(`Impossible de parser le JSON pour l'ID ${sub.id}:`, sub.form_json);
                // En cas d'erreur de format, on renvoie un objet d'erreur clair
                return { ...sub, form_json: { "Erreur": "Format JSON invalide en base de données" } };
            }
        });

        res.render('submissions', {
            title: 'Soumissions des Formulaires - eGouv',
            submissions: parsedSubmissions // On utilise la version corrigée
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        res.status(500).send("<h1>Erreur Serveur</h1><p>Impossible de récupérer les informations.</p>");
    } finally {
        if (connection) connection.release();
    }
});

// --- NOUVELLE ROUTE : POINT D'ENTRÉE POUR VOTRE CHATBOT ---
// Votre chatbot doit maintenant envoyer les nouvelles soumissions à CETTE route.
app.post('/api/submissions', async (req, res) => {
    const submissionData = req.body; // { service_title, wa_phoneNumber, etc. }

    /*
    // Logique d'insertion (peut être dans une fonction séparée)
    const sql = `INSERT INTO form_submissions (service_title, wa_phoneNumber, wa_name, form_json, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
    const params = [
        submissionData.service_title,
        submissionData.wa_phoneNumber,
        submissionData.wa_name,
        JSON.stringify(submissionData.form_json),
        submissionData.status || 'finalise'
    ];
    */

    try {
        //const [result] = await dbPool.execute(sql, params);
        const newId = submissionData.insertId;

        // Récupérer la ligne complète pour la diffuser
        const [rows] = await dbPool.execute('SELECT * FROM form_submissions WHERE id = ?', [newId]);
        const newSubmission = rows[0];

        // Diffuser la nouvelle soumission à tous les clients du tableau de bord
        if (newSubmission) {
            broadcastNewSubmission(newSubmission);
        }

        res.status(201).json({ success: true, id: newId });
    } catch (error) {
        console.error("Erreur lors de l'insertion de la soumission :", error);
        res.status(500).json({ success: false, message: 'Erreur de base de données.' });
    }
});

// --- NOUVELLE ROUTE API POUR LA SYNCHRONISATION ---
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

        res.json({
            success: true,
            message: 'Synchronisation réussie !',
            synchronized_at: syncDate.toISOString()
        });

    } catch (error) {
        console.error(`Erreur lors de la synchronisation pour l'ID ${id}:`, error);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la synchronisation.' });
    } finally {
        if (connection) connection.release();
    }
});

// Démarrer le serveur HTTP unifié
server.listen(PORT, () => {
    console.log(`🚀 Serveur web et WebSocket démarrés sur http://localhost:${PORT}`);
});
