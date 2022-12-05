'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{ // 一次新增三筆資料
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'root',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/male,female/?lock=${Math.random() * 100}`
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/male,female/?lock=${Math.random() * 100}`
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/male,female/?lock=${Math.random() * 100}`
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
