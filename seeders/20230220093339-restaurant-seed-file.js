'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Restaurants', Array.from({ length: 50 }, () => ({
      name: `${faker.name.fullName()} Restaurant`,
      tel: faker.phone.number('0#-#######'),
      address: `${faker.address.streetAddress(true)},${faker.address.cityName()},${faker.address.state()},${faker.address.county()}`,
      opening_hours: `${Math.floor(Math.random() * 24) + 1}:00`, // 回傳1:00~24:00
      description: faker.lorem.text(),
      image: faker.image.food(320, 240, true),
      created_at: new Date(),
      updated_at: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
}
