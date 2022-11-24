'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Restaurants',
    // 用 Array.from({ length: 50}) 產生長度為 50 的陣列，再 map 每一個陣列元素都對應到一筆餐廳資料
      Array.from({ length: 50 }, () => ({
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: '08:00',
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`, // ${Math.random() * 100} 使用這段程式碼 產生隨機的數字 取用隨機的圖片id
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
}
