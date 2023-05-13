'use strict'
const { faker } = require('@faker-js/faker')
const dayjs = require('dayjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Restaurants',
      Array.from({ length: 50 }, () => ({
        name: faker.company.name(),
        tel: faker.phone.number('##-########'),
        address: faker.address.streetAddress(true),
        opening_hours: dayjs(faker.datatype.datetime()).format('HH:mm'),
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${
          Math.random() * 100
        }`,
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
}
