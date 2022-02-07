'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const DEFAULT_MAX_COMMENTS = 50
    // obtain each restaurant ID from all exist seed users
    const seedUsers = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users`',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })).map(item => item.id)

    // obtain each restaurant ID from all exist seed restaurants
    const seedRestaurants = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Restaurants`',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })).map(item => item.id)

    // set a bulkInsert target to seed comments and record comments for each restaurant
    const commentsTable = {}
    const seedComments = Array.from({ length: DEFAULT_MAX_COMMENTS }, () => {
      const restaurant_id = seedRestaurants[Math.floor(Math.random() * seedRestaurants.length)]
      // count comment for each restaurant
      commentsTable[restaurant_id] = isNaN(commentsTable[restaurant_id])
        ? 1
        : ++commentsTable[restaurant_id]

      return {
        text: faker.lorem.sentence(),
        user_id: seedUsers[Math.floor(Math.random() * seedUsers.length)],
        restaurant_id,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    // update comment counts according to seed settings
    seedRestaurants.forEach(async restId => {
      if (typeof commentsTable[restId] === 'number') {
        const queryStatement = `UPDATE Restaurants SET comment_counts = ${commentsTable[restId]} WHERE id = ${restId}`
        await queryInterface.sequelize.query(queryStatement)
      }
    })

    // generate each record to table Comments according to the target and the settings
    await queryInterface.bulkInsert('Comments', seedComments)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    // delete all records from Comments Table
    await queryInterface.bulkDelete('Comments', null)

    // generate seed restaurant
    const seedRestaurants = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Restaurants`',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })).map(item => item.id)

    // reset each comment count for each restaurant
    seedRestaurants.forEach(async restId => {
      const queryStatement = `UPDATE Restaurants SET comment_counts = 0 WHERE id = ${restId}`
      await queryInterface.sequelize.query(queryStatement)
    })
  }
}
