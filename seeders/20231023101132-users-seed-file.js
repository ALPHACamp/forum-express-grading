'use strict'
const bcrypt = require('bcryptjs') // 加密密碼的模組
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      // 使用 queryInterface.bulkInsert 方法來插入資料至 Users 資料表
      'Users',
      [
        {
          // 一次新增三筆資料
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: true,
          name: 'root',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          name: 'user1',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          name: 'user2',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    // 使用 queryInterface.bulkDelete 方法來清空 Users 資料表中的所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
