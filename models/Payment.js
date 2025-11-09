import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Infraction, { foreignKey: 'infractionId' });
    }
  }
  Payment.init({
    montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    methode: {
      type: DataTypes.ENUM('mobile_money', 'carte_bancaire', 'gimac'),
      allowNull: false
    },
    reference_paiement: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    statut: {
      type: DataTypes.ENUM('initie', 'echoue', 'reussi'),
      allowNull: false,
      defaultValue: 'initie'
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments'
  });
  return Payment;
};