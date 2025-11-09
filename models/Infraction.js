import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Infraction extends Model {
    static associate(models) {
      Infraction.belongsTo(models.UserAdmin, { foreignKey: 'agentId', as: 'agentVerbalisateur' });
      Infraction.belongsTo(models.UserCitizen, { foreignKey: 'citoyenId', as: 'citoyenConcerne' });
      Infraction.belongsTo(models.InfractionType, { foreignKey: 'infractionTypeId', as: 'type' });
      Infraction.hasMany(models.Payment, { foreignKey: 'infractionId' });
    }
  }
  Infraction.init({
    plaque_immatriculation: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true
    },
    statut: {
      type: DataTypes.ENUM('en_attente', 'payee', 'en_retard'),
      allowNull: false,
      defaultValue: 'en_attente'
    },
    montant_actuel: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    date_emission: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    date_limite_paiement: {
      type: DataTypes.DATE,
      allowNull: false
    },
    photos_url: {
      type: DataTypes.JSON,
      allowNull: true
    },
    proces_verbal: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Infraction',
    tableName: 'infractions'
  });
  return Infraction;
};