'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      // migration 生效時需要一併把關聯設定起來
      references: {
        // model: '要被串接的tableName'
        // key: '要被串接的attribute'
        model: 'Categories',
        key: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'category_id')
  }
}
