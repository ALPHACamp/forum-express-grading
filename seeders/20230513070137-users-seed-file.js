'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: true,
          name: faker.internet.userName(),
          image: `https://robohash.org/set_set1/bgset_bg1/${Math.random()}?size=500x500`,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          name: faker.internet.userName(),
          image: `https://robohash.org/set_set1/bgset_bg1/${Math.random()}?size=500x500`,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          name: faker.internet.userName(),
          image: `https://robohash.org/set_set1/bgset_bg1/${Math.random()}?size=500x500`,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
