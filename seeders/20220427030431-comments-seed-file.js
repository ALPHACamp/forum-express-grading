'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [restaurants, users] = await Promise.all([
      queryInterface.sequelize.query('SELECT id FROM Restaurants;', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }),
      queryInterface.sequelize.query('SELECT id FROM Users;', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
    ])
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 50 }, () => ({
        text: faker.lorem.sentence(),
        restaurant_id:
          restaurants[Math.floor(Math.random() * restaurants.length)].id,
        user_id: users[Math.floor(Math.random() * users.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
