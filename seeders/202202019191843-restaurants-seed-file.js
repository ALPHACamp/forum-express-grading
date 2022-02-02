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
    const categories = await queryInterface.sequelize.query(
      'SELECT `id` FROM `Categories`',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }, () => {
        return {
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber(),
          opening_hours: '08:00',
          description: faker.lorem.text(),
          address: faker.address.streetAddress(),
          image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
          category_id: categories[Math.floor(Math.random() * categories.length)].id,
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
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
}
