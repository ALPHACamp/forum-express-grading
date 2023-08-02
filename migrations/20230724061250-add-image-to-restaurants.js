'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Restaurants', 'image', { type: Sequelize.STRING })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Restaurants', 'image', { /* query options */ })
  }
}
