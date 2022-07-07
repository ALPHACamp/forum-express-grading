'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@exaple.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'root',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'user1@exaple.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'user2@exaple.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('User', null, {})
  }
}
