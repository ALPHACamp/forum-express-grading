'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增以下三行，先去查詢現在 Categories 的 id 有哪些
    let categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    categories = categories.filter(category => category.id !== 99) // 排除顯示已刪除分類id=99
    await queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }, () => ({ // 先產生50個實體(undefined)，後面第二參數類似於map
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`, // 用隨機圖片的網站
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        category_id: categories[Math.floor(Math.random() * categories.length)].id // 增加這裡
        // 從前面查詢到的categories會返回由id組合成的陣列 其中隨機抽取一個id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
}
