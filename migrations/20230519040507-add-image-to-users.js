'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增image欄位
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
    // 移除image欄位
    await queryInterface.removeColumn('Users', 'image')
  }
}
