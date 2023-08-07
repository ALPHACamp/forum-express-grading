'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'root',
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://loremflickr.com/320/240/paris,girl?lock=15'
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://loremflickr.com/320/240/paris,girl?lock=212'
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://loremflickr.com/320/240/paris,girl?lock=30976'
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
