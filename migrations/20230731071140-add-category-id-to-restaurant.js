'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'category_Id',
      {
        type: Sequelize.INTEGER, // 用心曾的方法寫了Restaurant.j用init了
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id'
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'category_Id')
  }
}
