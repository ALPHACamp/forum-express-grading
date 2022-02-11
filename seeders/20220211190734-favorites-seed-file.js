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
    const favoriteUsersCount = {}
    // a list stores which favorite each user has
    const favoriteRestaurantsCount = {}

    // generate a set of seed favorites and count each favorite
    const seedFavorites = Array.from({ length: DEFAULT_MAX_FAVORITES }, () => {
      const restaurantId = seedRestaurants[Math.floor(Math.random() * seedRestaurants.length)]
      const userId = seedUsers[Math.floor(Math.random() * seedUsers.length)]
      // counts favorite restaurant for each user
      favoriteRestaurantsCount[userId] = isNaN(favoriteRestaurantsCount[userId])
        ? 1
        : ++favoriteRestaurantsCount[userId]
      // counts favorited time for each restaurant
      favoriteUsersCount[restaurantId] = isNaN(favoriteUsersCount[restaurantId])
        ? 1
        : ++favoriteUsersCount[restaurantId]

      return {
        user_id: userId,
        restaurant_id: restaurantId,
        created_at: new Date(),
        updated_at: new Date()
      }
    })
    // update favorite count for each user
    seedUsers.forEach(async userId => {
      const count = favoriteRestaurantsCount[userId]

      const queryStatement = `
      UPDATE Users SET favorite_count = ${count}
      WHERE id = ${userId}
      `
      await queryInterface.sequelize.query(queryStatement)
    })

    // update favorited count for each restaurant
    seedRestaurants.forEach(async restaurantId => {
      if (typeof favoriteUsersCount[restaurantId] === 'number') {
        const count = favoriteUsersCount[restaurantId]
        const queryStatement = `
          UPDATE Restaurants SET favorited_count = ${count}
          WHERE id = ${restaurantId}
        `
        await queryInterface.sequelize.query(queryStatement)
      }
    })

    // generate a sef of favorites to Favorites Table
    await queryInterface.bulkInsert('Favorites', seedFavorites)
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
