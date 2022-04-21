'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', // bulk 接收4個參數：table, array, (optionals...)
      ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
        .map(item => { // 如果傳入的是空陣列 Sequelize 會報錯。 map 函式的回傳值仍然是一個陣列
          return {
            name: item,
            created_at: new Date(),
            updated_at: new Date()
          }
        }
        ), {}) // 第三和四個參數不是必填，因目前沒有額外設定，所以傳了一個空物件 {}
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
}
