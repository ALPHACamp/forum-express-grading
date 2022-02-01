'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{ // 一次新增三筆資料
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'root',
      image: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user1',
      image: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user2',
      image: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }, { // 測試用
      email: 'aaa@aaa.aaa',
      password: 'aaa',
      is_admin: true,
      name: 'AAA',
      image: `https://loremflickr.com/320/240/monster/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
