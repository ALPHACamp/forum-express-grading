'use strict'

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
    const DEFAULT_MAX_FAVORITES = 50
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

    // a list stores which favorite each restaurant has
    const favoriteUsers = {}
    // a list stores which favorite each user has
    const favoriteRestaurants = {}

    const seederQueryArray = []
    let query = {}
    // generate a set of seed comments and count each comment
    for (let index = 0; index < DEFAULT_MAX_FAVORITES; index++) {
      let queryString = Object.keys(query).length ? JSON.stringify(query) : '[]'
      let userId = 0
      let restaurantId = 0

      while (JSON.stringify(seederQueryArray).includes(queryString)) {
        userId = seedUsers[Math.floor(Math.random() * seedUsers.length)]
        restaurantId = seedRestaurants[Math.floor(Math.random() * seedRestaurants.length)]
        query = {
          user_id: userId,
          restaurant_id: restaurantId
        }
        queryString = JSON.stringify(query)
      }
      query.created_at = new Date()
      query.updated_at = new Date()

      favoriteUsers[restaurantId] = isNaN(favoriteUsers[restaurantId])
        ? 1
        : ++favoriteUsers[restaurantId]

      favoriteRestaurants[userId] = isNaN(favoriteRestaurants[userId])
        ? 1
        : ++favoriteRestaurants[userId]

      seederQueryArray.push(query)
    }

    // update favorite count for each user
    seedUsers.forEach(async userId => {
      // each user with favorite list
      if (typeof favoriteRestaurants[userId] === 'number') {
        const count = favoriteRestaurants[userId]

        const queryStatement = `
          UPDATE Users SET favorite_count = ${count}
          WHERE id = ${userId}
        `
        await queryInterface.sequelize.query(queryStatement)
      }
      // each user without favorite list
      // do nothing
    })

    // update favorited count for each restaurant
    seedRestaurants.forEach(async restaurantId => {
      // each restaurant with favorited list
      if (typeof favoriteUsers[restaurantId] === 'number') {
        const count = favoriteUsers[restaurantId]
        const queryStatement = `
          UPDATE Restaurants SET favorited_count = ${count}
          WHERE id = ${restaurantId}
        `
        await queryInterface.sequelize.query(queryStatement)
      }
      // each restaurant without favorited list
      // do nothing
    })

    // generate a sef of favorites to Favorites Table
    await queryInterface.bulkInsert('Favorites', seederQueryArray)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    // remove all records from Favorites Table
    await queryInterface.bulkDelete('Favorites', null)

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

    // reset favorite count for each user
    seedUsers.forEach(async userId => {
      const queryStatement = `
      UPDATE Users SET favorite_count = 0 
      WHERE id = ${userId}
      `
      await queryInterface.sequelize.query(queryStatement)
    })

    // reset favorited count for each restaurant
    seedRestaurants.forEach(async restaurantId => {
      const queryStatement = `
      UPDATE Restaurants SET favorited_count = 0 
      WHERE id = ${restaurantId}`

      await queryInterface.sequelize.query(queryStatement)
    })
  }
}
