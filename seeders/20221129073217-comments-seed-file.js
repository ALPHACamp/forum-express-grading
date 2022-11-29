'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_SUBSTRING_MIN_NUM = 0
    const DEFAULT_SUBSTRING_MAX_NUM = 50
    // 先去查詢現在 Users 和 Restaurants 的 id 有哪些
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 30 }, () => ({
        text: faker.lorem.text().substring(DEFAULT_SUBSTRING_MIN_NUM, DEFAULT_SUBSTRING_MAX_NUM),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
