'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Restaurants', Array.from({ length: 50 }, () => ({
      name: `${faker.name.fullName()} Restaurant`,
      tel: faker.phone.number('0#-#######'),
      address: `${faker.address.streetAddress(true)},${faker.address.cityName()},${faker.address.state()},${faker.address.county()}`,
      opening_hours: `${(Math.floor(Math.random() * 24) + 1)}`.padStart(2, '0') + ':00', // 回傳01:00~24:00，padStart用來捕0
      description: faker.lorem.text(),
      image: faker.image.food(320, 240, true),
      category_id: categories[Math.floor(Math.random() * categories.length)].id,
      created_at: new Date(),
      updated_at: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
}
