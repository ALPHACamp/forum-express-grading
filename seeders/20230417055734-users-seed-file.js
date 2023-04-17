'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [{
      name: 'root2',
      email: 'root2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'user3',
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  }
}
