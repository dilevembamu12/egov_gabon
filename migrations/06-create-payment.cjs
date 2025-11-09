'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      montant: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      methode: {
        type: Sequelize.ENUM('mobile_money', 'carte_bancaire', 'gimac'),
        allowNull: false
      },
      reference_paiement: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      statut: {
        type: Sequelize.ENUM('initie', 'echoue', 'reussi'),
        allowNull: false,
        defaultValue: 'initie'
      },
      infractionId: {
        type: Sequelize.INTEGER,
        references: { model: 'infractions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  }
};