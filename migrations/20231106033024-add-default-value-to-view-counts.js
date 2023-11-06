'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
  // 首先，確保沒有記錄的 view_counts 是 NULL
    await queryInterface.sequelize.query(`
  UPDATE Restaurants
  SET view_counts = 0
  WHERE view_counts IS NULL
`)

    // 然後更改欄位屬性
    await queryInterface.changeColumn('Restaurants', 'view_counts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Restaurants', 'view_counts', {
      type: Sequelize.INTEGER,
      allowNull: true
      // 如果以前有預設值，你可以在這裡設置回去
    })
  }
}
