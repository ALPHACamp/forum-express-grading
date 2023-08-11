'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories',
      ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
        .map(item => {
          return {
            name: item,
            created_at: new Date(),
            updated_at: new Date()
          }
        }
        ), {})
    // 根據 Sequelize 文件，bulkInsert 的作用是一次將多筆資料插入資料表，此方法接收三個參數：
    // 資料表的名稱Categories table
    // 要放進去的資料陣列，這個陣列先用 map 語法來整理過
    // 第三和四個參數不是必填，因為目前沒有額外設定，所以傳了一個空物件 { }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
