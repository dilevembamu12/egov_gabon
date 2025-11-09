'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('infractions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      plaque_immatriculation: {
        type: Sequelize.STRING,
        allowNull: false
      },
      statut: {
        type: Sequelize.ENUM('en_attente', 'payee', 'en_retard'),
        allowNull: false,
        defaultValue: 'en_attente'
      },
      montant_actuel: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      date_emission: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      date_limite_paiement: {
        type: Sequelize.DATE,
        allowNull: false
      },
      photos_url: {
        type: Sequelize.JSON,
        allowNull: true
      },
      proces_verbal: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      agentId: {
        type: Sequelize.INTEGER,
        references: { model: 'users_admin', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      citoyenId: {
        type: Sequelize.INTEGER,
        references: { model: 'users_citizen', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      infractionTypeId: {
        type: Sequelize.INTEGER,
        references: { model: 'infraction_types', key: 'id' },
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
    await queryInterface.addIndex('infractions', ['plaque_immatriculation']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('infractions');
  }
};