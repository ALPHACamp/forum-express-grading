'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 此為直接操作資料庫需要使用底線命名
    await queryInterface.addColumn('Users', 'is_admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'is_admin')
  }
}
