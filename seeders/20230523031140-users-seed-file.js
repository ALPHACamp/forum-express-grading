'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{ // bulkInsert大量匯入語法，一次新增三筆資料
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10), // 記得await bcrypt 完成
      is_admin: true, // 給予管理員權限
      name: 'root',
      created_at: new Date(), // 獲取當下時間
      updated_at: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {}) // .bulkDelete() 批次刪除
  }
}
