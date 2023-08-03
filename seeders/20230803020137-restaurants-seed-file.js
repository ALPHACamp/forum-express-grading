'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 查詢Categories的id有哪些
    const categories = await queryInterface.sequelize.query('SELECT id FROM Categories;', { type: queryInterface.sequelize.QueryTypes.SELECT })

    await queryInterface.bulkInsert('Restaurants',
    // Array.from()內第二個參數是mapFn，下方直接簡寫
      Array.from({ length: 50 }, () => ({
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        // 圖片使用LoremFlickr(網站)提供的資源
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
