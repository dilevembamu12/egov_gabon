'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ÉTAPE 1: Vider la table pour la rendre ré-exécutable
    await queryInterface.bulkDelete('infraction_types', null, {});

    // ÉTAPE 2: Insérer les données
    await queryInterface.bulkInsert('infraction_types', [
      {
        nom: 'Excès de vitesse (Ville)',
        montant_base: 15000,
        delai_paiement_jours: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Stationnement gênant',
        montant_base: 5000,
        delai_paiement_jours: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Défaut de contrôle technique',
        montant_base: 25000,
        delai_paiement_jours: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('infraction_types', null, {});
  }
};