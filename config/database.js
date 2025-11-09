import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Connexion pour l'application (ESM)
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

export default sequelize;