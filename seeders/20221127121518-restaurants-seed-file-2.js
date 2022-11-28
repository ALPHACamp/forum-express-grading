'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 從queryInterface用SQL語法請求categories裡的id資料
    const categories = await queryInterface.sequelize.query('SELECT id FROM Categories', { type: queryInterface.sequelize.QueryTypes.SELECT })// 請求的資料類型
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
        // 根據categories長度決定取出的亂數號碼=categories元素位置
      }))
      , {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
}
