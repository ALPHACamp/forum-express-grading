'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => { // 由於這邊直接對資料庫做操作所以要用Snake case
    await queryInterface.addColumn('Restaurants', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
