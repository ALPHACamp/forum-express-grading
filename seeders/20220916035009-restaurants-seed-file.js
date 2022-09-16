'use strict'
const { faker } = require('@faker-js/faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Restaurants', Array.from({ length: 50 }, () => ({
      name: faker.name.fullName(),
      tel: faker.phone.number(),
      address: faker.address.streetAddress(),
      opening_hours: '10:10',
      image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      description: faker.lorem.text(),
      created_at: new Date(),
      updated_at: new Date()
    }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
}
