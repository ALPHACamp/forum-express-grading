'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'viewCounts', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'viewCounts')
  }
}
