'use strict'
const moment = require('moment')
const DateGenerator = require('random-date-generator')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Query all users and restaurants then return ids
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    // Seed data configurations
    const numberOfViews = users.length * restaurants.length * 10
    // Set date range from 3 months ago to now
    const now = new Date(moment())
    const then = new Date(moment().subtract(3, 'months'))

    // Set random date
    await queryInterface.bulkInsert(
      'Views',
      Array.from({ length: numberOfViews }, () => ({
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: DateGenerator.getRandomDateInRange(then, now),
        updated_at: new Date()
      })),
      {}
    )

    // Update restaurants
    for (const rest of restaurants) {
      // Count total views for each restaurant
      const view = await queryInterface.sequelize.query(
        `SELECT COUNT(id) AS "count" FROM Views WHERE restaurant_id = ${rest.id};`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )

      // Update restaurants' viewCounts number
      await queryInterface.sequelize.query(
        `UPDATE Restaurants SET view_counts = ${view[0].count} WHERE id = ${rest.id}`,
        { type: queryInterface.sequelize.QueryTypes.UPDATE }
      )
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Views', null, {})
  }
}
