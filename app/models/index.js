import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import sequelizeInstance from '../config/database.js';
import UserAdminModel from './UserAdmin.js';
import UserCitizenModel from './UserCitizen.js';
import InfractionTypeModel from './InfractionType.js';
import InfractionModel from './Infraction.js';
import PaymentModel from './Payment.js';
import PenaltyRuleModel from './PenaltyRule.js';

const db = {};

// Initialisation de tous les modèles
const models = {
    UserAdmin: UserAdminModel(sequelizeInstance, Sequelize.DataTypes),
    UserCitizen: UserCitizenModel(sequelizeInstance, Sequelize.DataTypes),
    InfractionType: InfractionTypeModel(sequelizeInstance, Sequelize.DataTypes),
    Infraction: InfractionModel(sequelizeInstance, Sequelize.DataTypes),
    Payment: PaymentModel(sequelizeInstance, Sequelize.DataTypes),
    PenaltyRule: PenaltyRuleModel(sequelizeInstance, Sequelize.DataTypes)
};

// Application des associations
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

// Exporte les modèles initialisés
db.UserAdmin = models.UserAdmin;
db.UserCitizen = models.UserCitizen;
db.InfractionType = models.InfractionType;
db.Infraction = models.Infraction;
db.Payment = models.Payment;
db.PenaltyRule = models.PenaltyRule;

export default db;