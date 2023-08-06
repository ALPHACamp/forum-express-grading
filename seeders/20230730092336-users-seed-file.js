'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'
    }, {
      name: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'
    }, {
      name: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
