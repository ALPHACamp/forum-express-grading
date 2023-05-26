'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const maxTextLength = 50
    // 先查詢資料庫並獲取 USERS 表中的所有 id
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM USERS;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 先查詢資料庫並獲取 RESTAURANTS 表中的所有 id
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM RESTAURANTS;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 20 }, () => ({
        text: faker.lorem.text().slice(0, maxTextLength),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: users[Math.floor(Math.random() * (users.length))].id,
        restaurant_id:
          restaurants[Math.floor(Math.random() * (restaurants.length))].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
