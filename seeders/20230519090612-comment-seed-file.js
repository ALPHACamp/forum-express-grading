'use strict'

const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 查詢user跟餐廳的所有id
    const [restaurants, users] = await Promise.all([
      queryInterface.sequelize.query('SELECT id From Restaurants', { type: queryInterface.sequelize.QueryTypes.SELECT }),
      queryInterface.sequelize.query('SELECT id From Users', { type: queryInterface.sequelize.QueryTypes.SELECT })
    ])
    // 產生30筆假評論隨機分給餐廳跟user
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 30 }, () => ({
        text: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        user_id: users[Math.floor(Math.random() * users.length)].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
