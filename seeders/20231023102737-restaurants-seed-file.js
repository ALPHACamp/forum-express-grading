'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 為了將Categories的id放置進Restaurants，首先是先了解Categories的id有多少，且其id值為多少
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;', // 使用SQL 查詢語句，查詢Categories' 表中的所有 'id' 欄位
      // type: 指定查詢的類型
      // QueryTypes.SELECT 表明這是一個選擇查詢（SELECT query），目的是獲取資料而非修改資料
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 出來的值，會是一個陣列，[{id:1},{id:2},{id:3}]

    await queryInterface.bulkInsert(
      'Restaurants',
      Array.from({ length: 50 }, () => ({
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${
          Math.random() * 100
        }`,
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
