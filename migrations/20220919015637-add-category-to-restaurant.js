'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'category_id', {
      type: Sequelize.INTEGER, // 餐廳類別: 必填
      allowNull: false,
      references: { // 設置關聯
        model: 'Categories',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'category_id')
  }
}
