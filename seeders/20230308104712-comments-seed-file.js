'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => { // 先查詢彼此有1對多關係的使用者跟餐廳id
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Comments', Array.from({ length: 20 }, (_, index) => ({
      text: faker.lorem.sentence(),
      user_id: users[Math.floor(Math.random() * users.length)].id,
      restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
      created_at: new Date(),
      updated_at: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
