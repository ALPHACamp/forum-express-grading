'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Restaurants', {
      fields: ['category_id'],
      type: 'foreign key',
      name: 'categories_restaurants_constraint',
      references: {
        table: 'Categories',
        field: 'id'
      },
      onDelete: 'cascade'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      'Restaurants',
      'categories_restaurants_constraint'
    )
  }
}
