'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const comments = []
    for (let i = 0; i < 10; i++) {
      comments.push(
        {
          text: faker.lorem.words(20),
          user_id: users[0].id,
          created_at: new Date(),
          updated_at: new Date(),
          restaurant_id:
            restaurants[Math.floor(Math.random() * restaurants.length)].id
        },
        {
          text: faker.lorem.words(20),
          user_id: users[1].id,
          created_at: new Date(),
          updated_at: new Date(),
          restaurant_id:
            restaurants[Math.floor(Math.random() * restaurants.length)].id
        }
      )
    }
    await queryInterface.bulkInsert('Comments', comments)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
