'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 查詢現在 User 的 id
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 查詢現在 Restaurant 的 id
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 15 }, () => ({
        text: faker.lorem.sentence(),
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
