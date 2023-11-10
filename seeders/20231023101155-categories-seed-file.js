'use strict'
// 在Categories中新增一組seeder資料
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 使用bulkInsert方法，是將多筆資料插入資料表
    await queryInterface.bulkInsert('Categories',
    // 利用map方法，將資料逐一傳遞，且map在回傳值也是陣列回傳
      ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理'].map(item => {
        return {
          name: item,
          created_at: new Date(),
          updated_at: new Date()
        }
      }), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', {})
  }
}
