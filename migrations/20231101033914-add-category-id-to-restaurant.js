'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 直接操作資料庫欄位，因次使用 snake case
    // 使用queryInterface.addColumn來新增欄位
    await queryInterface.addColumn('Restaurants', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: true, // 不允許空值
      // 非常重要的關聯，當這筆migration生效時，一併將關聯設定起來
      // 也就是告訴資料夾說，在設定這個欄位時，順便將其關聯
      references: {
        model: 'Categories',
        key: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'category_id')
  }
}
