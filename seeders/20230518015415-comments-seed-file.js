'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // get user id
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // get restaurant id
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // insert seed data
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 30 }, () => ({
        text: faker.lorem.paragraph(1),
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        user_id: users[Math.floor(Math.random() * users.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      })
      )
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
