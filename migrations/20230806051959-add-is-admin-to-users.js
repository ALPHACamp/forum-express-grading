'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 直接操作資料庫
    // MIGRATION 裡 欄位 要加 底線    資料表  要新增的欄位名稱
    await queryInterface.addColumn('Users', 'is_admin', {
      // 定義這個欄位的屬性
      type: Sequelize.BOOLEAN,
      defaultValue: false
      // after: 'columnB'
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'is_admin')
  }
}
