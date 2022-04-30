'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    const restaurants = await queryInterface.sequelize.query('SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }, () => ({
        text: faker.name.findName(),
        userId: users[Math.floor(Math.random() * users.length)].id,
        restaurantId: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
