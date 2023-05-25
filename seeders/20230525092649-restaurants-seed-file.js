'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }, () => ({ // 產出長度50的陣列
        name: faker.name.findName(), // 使用faker產出name資料
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`, // 圖片產出網站，可修改restaurant,food產出其他圖片，並隨機從1-100張編號中選取
        description: faker.lorem.text(500), // 用faker產出類文章
        created_at: new Date(),
        updated_at: new Date(),
        category_id: categories[Math.floor(Math.random() * categories.length)].id // 依categories數量跑出亂數抓其id
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
}
