'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // queryInterface.addColumn(要操作的資料表 (table)需要字串來指定, 要新增的欄位名稱, 定義這個欄位的屬性, 非必須 可以根據需求來加更多設定選項)
    // 在直接操作資料庫的情況，字串並不會被自動轉換，所以你需要直接寫字串並不會被自動轉換的用法 is_admin
    await queryInterface.addColumn('Users', 'is_admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'is_admin')
  }
}
