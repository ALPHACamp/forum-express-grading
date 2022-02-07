'use strict'
const moment = require('moment')
const DateGenerator = require('random-date-generator')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Query all users and restaurants then return ids.
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // Seed data configuration
    const numberOfComments = users.length * restaurants.length * 3
    // Set date range from 3 months ago to now
    const now = new Date(moment())
    const then = new Date(moment().subtract(3, 'months'))

    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: numberOfComments }, () => ({
        text: faker.lorem.sentence(),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id:
          restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: DateGenerator.getRandomDateInRange(then, now),
        updated_at: new Date()
      })),
      {}
    )

    // Update restaurant comment counts
    for (const rest of restaurants) {
      const comment = await queryInterface.sequelize.query(
        `SELECT COUNT(id) AS "count" FROM Comments WHERE restaurant_id = ${rest.id};`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )

      await queryInterface.sequelize.query(
        `UPDATE Restaurants SET comment_counts = ${comment[0].count} WHERE id = ${rest.id}`,
        { type: queryInterface.sequelize.QueryTypes.UPDATE }
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
