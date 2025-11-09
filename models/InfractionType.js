import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class InfractionType extends Model {
    static associate(models) {
      InfractionType.hasMany(models.Infraction, { foreignKey: 'infractionTypeId' });
    }
  }
  InfractionType.init({
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    montant_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    delai_paiement_jours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30
    }
  }, {
    sequelize,
    modelName: 'InfractionType',
    tableName: 'infraction_types'
  });
  return InfractionType;
};