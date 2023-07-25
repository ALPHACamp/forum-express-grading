'use strict'
const { fakerZH_TW: faker } = require('faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const restaurantSeeds = Array.from({ length: 50 }, (_, i) => {
      return {
        name: `${faker.company.name()}餐廳`,
        tel: faker.phone.number(),
        opening_hours: `${new Date(faker.date.anytime()).getHours()}:00`,
        description: faker.lorem.sentences(3, '\n'),
        address: faker.location.streetAddress(),
        created_at: new Date(),
        updated_at: new Date(),
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.floor(Math.random() * 100)}`
      }
    })
    await queryInterface.bulkInsert('Restaurants', restaurantSeeds, {})
  },

  async down (queryInterface, Sequelize) {
    // 所有的restaurant都會被刪掉
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
}
