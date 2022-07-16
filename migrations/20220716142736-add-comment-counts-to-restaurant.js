'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'comment_counts', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'comment_counts')
  }
}
