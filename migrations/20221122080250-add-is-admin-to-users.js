'use strict'
// npx sequelize db:migrate
// npx sequelize db:migrate:undo 一次退一個版本
// npx sequelize db:migrate:undo:all 退到初始狀態
// npx sequelize db:migrate:undo:all --to XXXXXXXXXXXXXX-create-user.js 退到指定版本

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 第一個參數是要操作的資料表 (table)：需要一個字串來指定
    // 第二個參數是要新增的欄位名稱 （column name)：需要一個字串來指定欄位
    // 第三個參數是定義這個欄位的屬性 (attribute)
    // 第四個參數不是必須的，可以根據需求來加更多設定選項 (這裡沒用到)
    // 直接操作資料庫時必須要用 _，後端創建的時候才可以isAdmin搭配副指令 --underscored
    await queryInterface.addColumn('Users', 'is_admin', {
      type: Sequelize.BOOLEAN, // mySQL是用tinyint(1)處理布林
      defaultValue: false
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'is_admin')
  }
}
