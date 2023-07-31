'use strict'
const { fakerZH_TW: faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 先把categories全部撈出來，用他們的id建立restaurant
    const categories = await queryInterface.sequelize.query(
      'SELECT `id` FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurantSeeds = Array.from({ length: 50 }, (_, i) => {
      return {
        name: `${faker.company.name()}餐廳`,
        tel: faker.phone.number(),
        opening_hours: `${new Date(faker.date.anytime()).getHours()}:00`,
        description: faker.lorem.sentences(3, '\n'),
        address: faker.location.streetAddress(),
        created_at: new Date(),
        updated_at: new Date(),
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.floor(Math.random() * 100)}`,
        category_id: categories[Math.floor(Math.random() * categories.length)].id
      }
    })
    await queryInterface.bulkInsert('Restaurants', restaurantSeeds, {})
  },

  async down (queryInterface, Sequelize) {
    // 所有的restaurant都會被刪掉
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
}
