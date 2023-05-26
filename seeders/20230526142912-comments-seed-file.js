'use strict'

const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      // users 是一個陣列，包含了 Users 表格中的 id 值
      'SELECT id FROM Users;', // 選擇 Users 表格中的 id 列
      { type: queryInterface.sequelize.QueryTypes.SELECT } // 執行一個 SELECT 查詢並返回結果
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 50 }, () => ({
        text: faker.lorem.sentence(),
        // 隨機選取現有的 user & restaurants_id
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id:
          restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
