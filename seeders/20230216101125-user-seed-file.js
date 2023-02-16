'use strict'
const bcrypt = require('bcryptjs')
const users = require('../seedersData/user')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const a = [...users.map(user => user)]
    // console.log(a)
    await queryInterface.bulkInsert('Users', Array.from({ length: users.length }, (_, i) => {
      const { name, email, password } = users[i]
      return {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        created_at: new Date(),
        updated_at: new Date()
      }
    }))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
