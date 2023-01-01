'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Restaurants', Array.from({ length: 50 }, () => ({ // 必須用( )將物件格式包起來，如果沒包起來，箭頭函式的寫法會將大括號視為區塊標示
      name: faker.name.findName(),
      tel: faker.phone.phoneNumber('0#-###-####'),
      address: faker.address.streetAddress(),
      opening_hours: '08:00',
      image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
      description: faker.lorem.text(),
      created_at: new Date(),
      updated_at: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
}
