'use strict';
const bcrypt = require('bcryptjs');

// Fonction pour hasher les mots de passe
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users_citizen', [
      {
        cni: '0101123456',
        password: hashPassword('citoyen123'),
        nom_complet: 'Jean Dupont',
        telephone: '077112233',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cni: '0102123457',
        password: hashPassword('citoyen123'),
        nom_complet: 'Marie Kassa',
        telephone: '066223344',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cni: '0103123458',
        password: hashPassword('citoyen123'),
        nom_complet: 'Pierre Ndong',
        telephone: '074334455',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users_citizen', null, {});
  }
};