'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 這邊使用is_admin而非isAdmin是因為使用Sequelize語法直接操作資料庫，若用js操作資料庫則使用isAdmin即可(在Model中有設定會被轉換is_admin)
    await queryInterface.addColumn('Users', 'is_admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'is_admin')
  }
}
