'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Comments', 'restaurant_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Restaurants',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Comments', 'restaurant_id')
  }
}
