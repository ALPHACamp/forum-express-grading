'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const maxTextLength = 80
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 40 }, () => ({
        text: faker.lorem.text().slice(0, maxTextLength),
        created_at: new Date(),
        updated_at: new Date(),
        // 考量到雲端的database, 產生資料時id可能會跳號
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
