'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先取得目前 cate 表單內現有的資料(此先決條件是 cate 種子資料要先建立)
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    ) // [[object Object], ....]

    await queryInterface.bulkInsert('Restaurants', Array.from({ length: 50 }, () => ({
      name: faker.name.findName(),
      tel: faker.phone.phoneNumber(),
      address: faker.address.streetAddress(),
      opening_hours: '08:00',
      image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      description: faker.lorem.text(),
      created_at: new Date(),
      updated_at: new Date(),
      category_id: categories[Math.floor((Math.random() * categories.length))].id // 製作隨機下標(0 ~ categories.length-1)，到 categories 用下標後再 key 取值
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
}
