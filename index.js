// Importer les modules nécessaires
import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';

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
    res.render('landing', { title: 'e-Gouv Gabon - Accueil' });
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

// --- ROUTES API (inchangées) ---
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

// Démarrer le serveur HTTP unifié
server.listen(PORT, () => {
    console.log(`🚀 Serveur web démarré sur http://localhost:${PORT}`);
    console.log(`➡️  Page d'accueil : http://localhost:${PORT}`);
    console.log(`➡️  Dashboard      : http://localhost:${PORT}/dashboard`);
});

