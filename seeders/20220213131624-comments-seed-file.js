'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // get users id
    const users = await queryInterface.sequelize.query('SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    // get restaurants id
    const restaurants = await queryInterface.sequelize.query('SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 80 }, () => ({
        text: faker.lorem.text().slice(0, 200),
        user_id: users[getRandomAssignIndex(users.length)].id,
        restaurant_id: restaurants[getRandomAssignIndex(restaurants.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}

function getRandomAssignIndex (length) {
  return Math.floor(Math.random() * length)
}
