'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'category_id', { // 在restaurants新增category_id欄位
      type: Sequelize.INTEGER,
      allowNull: false, // 不予許空白
      references: { // 指定在這筆 migration 生效時，需要一併把關聯設定起來
        model: 'Categories',
        key: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'category_id')
  }
}
