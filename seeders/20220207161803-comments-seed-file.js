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

    const seedUsers = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Users`',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })).map(item => item.id)

    const seedRestaurants = (await queryInterface.sequelize.query(
      'SELECT `id` FROM `Restaurants`',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })).map(item => item.id)

    await queryInterface.bulkInsert('Comments',
      Array.from({ length: DEFAULT_MAX_COMMENTS }, () => {
        return {
          text: faker.lorem.sentence(),
          // user_id: 22,
          user_id: seedUsers[Math.floor(Math.random() * seedUsers.length)],
          // restaurant_id: 351,
          restaurant_id: seedRestaurants[Math.floor(Math.random() * seedRestaurants.length)],
          created_at: new Date(),
          updated_at: new Date()
        }
      }))
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Comments', null)
  }
}
