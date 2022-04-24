'use strict'
const faker = require('faker')
const queryString= process.env.NODE_ENV === 'production'?'SELECT id FROM public."Categories";':'SELECT id FROM Categories;'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await queryInterface.sequelize.query(
      queryString,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }, () => ({
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        category_id: categories[Math.floor(Math.random() * categories.length)].id
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
}
