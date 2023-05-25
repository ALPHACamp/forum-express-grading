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
    const restaurantsId = await queryInterface.sequelize.query('SELECT id FROM Restaurants;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    const usersId = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Comments', Array.from({ length: 30 }, () => ({
      text: faker.lorem.sentence(),
      created_at: new Date(),
      updated_at: new Date(),
      user_id: usersId[Math.floor(Math.random() * usersId.length)].id,
      restaurant_id: restaurantsId[Math.floor(Math.random() * restaurantsId.length)].id
    })))
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Comments', {})
  }
}
