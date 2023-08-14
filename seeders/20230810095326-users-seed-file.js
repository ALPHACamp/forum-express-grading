'use strict'

const users =
  [
    {
      email: 'root@example.com',
      password: '12345678',
      is_admin: true,
      name: 'root'
    },
    {
      email: 'user1@example.com',
      password: '12345678',
      is_admin: false,
      name: 'user1'
    },
    {
      email: 'user2@example.com',
      password: '12345678',
      is_admin: false,
      name: 'user2'
    }
  ]

const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', await users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null),
      image: `https://loremflickr.com/320/240/human/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    })), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
