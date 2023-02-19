'use strict'
const { v4: uuidv4 } = require('uuid')
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
        created_at: new Date(),
        updated_at: new Date()
      }
    }))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
