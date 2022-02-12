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
      'SELECT `id` FROM `Users`', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })).map(item => item.id)

    // obtain each restaurant ID from all exist seed restaurants
    const seedRestaurants = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Restaurants`', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })).map(item => item.id)

    // a list stores which comment each restaurant has
    const restComments = {}
    // a list which stores each restaurant each user has commented
    const userComments = Array.from({ length: seedUsers.length }, () => ({}))

    const seedComments = Array.from({ length: DEFAULT_MAX_COMMENTS }, () => {
      const currentUserIndex = Math.floor(Math.random() * seedUsers.length)

      const restaurantId = seedRestaurants[Math.floor(Math.random() * seedRestaurants.length)]
      const userId = seedUsers[currentUserIndex]
      // records a restaurant he/she commented
      userComments[currentUserIndex][restaurantId] = true
      // counts comment for each restaurant
      restComments[restaurantId] = isNaN(restComments[restaurantId])
        ? 1
        : ++restComments[restaurantId]

      return {
        text: faker.lorem.sentence(),
        user_id: userId,
        restaurant_id: restaurantId,
        created_at: new Date(),
        updated_at: new Date()
      }
    })

    // update comment count for each restaurant
    seedRestaurants.forEach(async restId => {
      if (typeof restComments[restId] === 'number') {
        const queryStatement = `
          UPDATE Restaurants SET commented_count = ${restComments[restId]}
          WHERE id = ${restId}
        `
        await queryInterface.sequelize.query(queryStatement)
      }
    })

    // update restaurant comment count for each user
    userComments.forEach(async (list, index) => {
      const queryStatement = `
        UPDATE Users SET rest_comment_count = ${Object.keys(list).length}
        WHERE id = ${seedUsers[index]}
      `
      await queryInterface.sequelize.query(queryStatement)
    })

    // generate a sef of comments to Comments Table
    await queryInterface.bulkInsert('Comments', seedComments)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    // remove all records from Favorites Table
    await queryInterface.bulkDelete('Comments', null)

    // obtain each restaurant ID from all exist seed users
    const seedUsers = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users`', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })).map(item => item.id)

    // obtain each restaurant ID from all exist seed restaurants
    const seedRestaurants = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Restaurants`', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })).map(item => item.id)

    // reset restaurant comment count for each user
    seedUsers.forEach(async userId => {
      const queryStatement = `
      UPDATE Users SET rest_comment_count = 0 
      WHERE id = ${userId}`

      await queryInterface.sequelize.query(queryStatement)
    })

    // reset comment count for each restaurant
    seedRestaurants.forEach(async restId => {
      const queryStatement = `
      UPDATE Restaurants SET commented_count = 0 
      WHERE id = ${restId}`
      await queryInterface.sequelize.query(queryStatement)
    })
  }
}
