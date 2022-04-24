'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          // 一次新增三筆資料
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: true, // 注意這裏因爲是直接將資料寫入 database ！所以一定要加 _ 底綫
          name: 'root',
          image: 'https://thispersondoesnotexist.com/image',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          name: 'user1',
          image: 'https://thispersondoesnotexist.com/image',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          name: 'user2',
          image: 'https://thispersondoesnotexist.com/image',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', null, {})
  }
}
