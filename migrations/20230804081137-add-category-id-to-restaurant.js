'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'Categories',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.remove('Restaurants', 'category_id')
  }
}
