'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 用 bulkInsert 一次將多筆資料插入資料表
    await queryInterface.bulkInsert('Categories', // 資料表的名稱
      // 放進去的資料陣列，會先用 map 來整理
      ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
        .map(item => {
          return {
            name: item,
            created_at: new Date(),
            updated_at: new Date()
          }
        }
        // 第三和四個參數不是必填，因為目前沒有額外設定，所以傳一個空物件 {}
        ), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', {})
  }
}
