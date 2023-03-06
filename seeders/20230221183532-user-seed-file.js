'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'root',
      image: 'https://loremflickr.com/320/240',
      created_at: new Date(),
      updated_at: new Date()
    },
    ...Array.from({ length: 5 }, (_, index) => {
      return {
        email: `user${index + 1}@example.com`,
        password: bcrypt.hashSync('12345678', 10),
        is_admin: false,
        name: `user${index + 1}`,
        image: `https://loremflickr.com/320/240?lock=${index}`,
        created_at: new Date(),
        updated_at: new Date()
      }
    })], {})
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
