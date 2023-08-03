'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      '中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理'
    ].map(category => {
      return {
        name: category,
        created_at: new Date(),
        updated_at: new Date()
      }
    }), {}) // 第三和四個參數不是必填，因為目前沒有額外設定，所以講師傳了一個空物件 {}
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', {})
  }
}
