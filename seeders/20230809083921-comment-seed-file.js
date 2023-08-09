'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const restaurant = await queryInterface.sequelize.query('SELECT id FROM Restaurants;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const user = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 10 }, () => ({
        text: faker.name.findName(),
        user_id: user[Math.floor(Math.random() * 2)].id,
        restaurant_id: restaurant[Math.floor(Math.random() * 10)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
