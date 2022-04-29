'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{ // 一次新增三筆資料
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'root',
      image: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user1',
      image: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user2',
      image: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {}) // 第三個參數可以指定 where 條件，但這裡因為全部刪除，所以只傳入空物件。
  }
}
