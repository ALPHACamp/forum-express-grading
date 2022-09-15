'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => { // queryInterface 屬於直接操作資料庫，所以之前 underscored 設定不會套用到這邊，需要自己加 _
    await queryInterface.addColumn('Users', 'is_admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'is_admin')
  }
}
