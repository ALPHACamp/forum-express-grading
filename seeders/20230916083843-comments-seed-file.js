'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const COMMENT_AMOUNT = 20
    const [users, restaurants] = await Promise.all(['Users', 'Restaurants'].map(table => (
      queryInterface.sequelize.query(
        `SELECT id FROM ${table};`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    )))

    if (users.length && restaurants.length) {
      await queryInterface.bulkInsert('Comments', Array.from({ length: COMMENT_AMOUNT }, () => ({
        text: faker.lorem.text().slice(0, 50),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      })))
    } else throw new Error('Each counts of user and restarant must be at least one')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
