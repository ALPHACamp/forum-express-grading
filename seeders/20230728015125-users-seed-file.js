'use strict'
const bcrypt = require('bcryptjs')
const { PROFILE_DEFAULT_AVATAR } = require('../helpers/file-helper')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
      image: PROFILE_DEFAULT_AVATAR
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date(),
      image: PROFILE_DEFAULT_AVATAR
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date(),
      image: PROFILE_DEFAULT_AVATAR
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
