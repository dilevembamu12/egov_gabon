import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class PenaltyRule extends Model {
    static associate(models) {
      // Pas d'association
    }
  }
  PenaltyRule.init({
    jours_apres_delai: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type_penalite: {
      type: DataTypes.ENUM('fixe', 'pourcentage'),
      allowNull: false
    },
    valeur: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PenaltyRule',
    tableName: 'penalty_rules'
  });
  return PenaltyRule;
};