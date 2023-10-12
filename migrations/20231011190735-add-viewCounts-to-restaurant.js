'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 此行是錯誤的！！！！
    // await queryInterface.addColumn('Restaurants', 'viewCounts', {
    await queryInterface.addColumn('Restaurants', 'view_counts', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    // 此行是錯誤的！！！！
    // await queryInterface.removeColumn('Restaurants', 'viewCounts')
    await queryInterface.removeColumn('Restaurants', 'view_counts')
  }
}
