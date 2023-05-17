'use strict'
const { faker } = require('@faker-js/faker')
const dayjs = require('dayjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 查詢 Categories的所有id
    const categories = await queryInterface.sequelize.query('SELECT id FROM Categories;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert(
      'Restaurants',
      Array.from({ length: 50 }, () => ({
        name: faker.company.name(),
        tel: faker.phone.number('##-########'),
        address: faker.address.streetAddress(true),
        opening_hours: dayjs(faker.datatype.datetime()).format('HH:mm'),
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        category_id: categories[Math.floor(Math.random() * categories.length)].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
}
