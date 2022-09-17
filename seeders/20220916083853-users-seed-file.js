'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('123456', 10),
      is_admin: true,
      name: 'root',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'root1@example.com',
      password: await bcrypt.hash('123456', 10),
      is_admin: false,
      name: 'root1',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'root2@example.com',
      password: await bcrypt.hash('123456', 10),
      is_admin: false,
      name: 'root2',
      created_at: new Date(),
      updated_at: new Date()
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
