'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const field = await Promise.all([
      getFakeUser('root', true),
      getFakeUser('user1', false),
      getFakeUser('user2', false)
    ])
    await queryInterface.bulkInsert('Users', field, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}

async function getFakeUser (name, isAdmin) {
  try {
    return {
      email: `${name}@example.com`,
      password: await bcrypt.hash('12345678', 10),
      is_admin: isAdmin,
      name,
      created_at: new Date(),
      updated_at: new Date()
    }
  } catch (error) {
    console.error(error)
  }
}
