'use strict';
const bcrypt = require('bcryptjs');

const passwordHash = bcrypt.hashSync('superadmin123', 10);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users_admin', [
      {
        username: 'superadmin',
        password: passwordHash,
        role: 'administrateur',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'agent_controle',
        password: passwordHash,
        role: 'agent_controle',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'agent_verbal',
        password: passwordHash,
        role: 'agent_verbalisateur',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users_admin', null, {});
  }
};