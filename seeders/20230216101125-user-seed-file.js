'use strict'
const { v4: uuidv4 } = require('uuid')
const { faker } = require('@faker-js/faker')
const bcrypt = require('bcryptjs')
const users = require('../seedersData/user')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', Array.from({ length: users.length }, (_, i) => {
      const { name, email, password, isAdmin } = users[i]
      return {
        id: uuidv4(),
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        is_admin: isAdmin,
        image: faker.image.cats(360, 360, true),
        created_at: new Date(),
        updated_at: new Date()
      }
    }))
    await queryInterface.bulkInsert('Users', Array.from({ length: 10 }, (_, i) => ({
      id: uuidv4(),
      name: faker.name.middleName(),
      email: `test${i}@test.com`,
      password: bcrypt.hashSync('12345678', 10),
      is_admin: false,
      image: faker.image.cats(360, 360, true),
      created_at: new Date(),
      updated_at: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
