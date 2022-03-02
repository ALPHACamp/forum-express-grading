'use strict'

// for setting password
const bcrypt = require('bcryptjs')
const defaultAvatar = 'https://i.imgur.com/TtMC6Kd.png'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: defaultAvatar
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: defaultAvatar
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date(),
      avatar: defaultAvatar
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {}) // 清空資料表中所有資料，第二個參數可以指定 where 條件
  }
}
