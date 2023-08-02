'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'category_Id',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id'
        }
      }
    )
    await queryInterface.createTable('users', { id: Sequelize.INTEGER })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Restaurants', 'category_Id')
  }
}
