'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{ // 插入內容：一次新增三筆資料
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10), // 每次加密的 salt 都不同，所以就算是相同的密碼，hash 出來會有不同的長相
      is_admin: true,
      name: 'root',
      created_at: new Date(), // create_at、update_at、is_admin 記得要寫
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

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', {}) // 將大量資料刪除，但資料表還是存在
  }
}
