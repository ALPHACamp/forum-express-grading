// npx sequelize db:seed:all 執行seeders中全部的檔案 (做過仍會重複做)
// npx sequelize db:seed --seed 20221123042540-users-seed-file (執行單筆)
/*
heroku run npx sequelize db:seed:undo:all
heroku run npx sequelize db:migrate:undo:all
heroku run npx sequelize db:migrate
heroku run npx sequelize db:seed:all
 */
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
          is_admin: true,
          name: 'root',
          created_at: new Date(), // js內建語法
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
      {} // 第二個參數可以指定 where 條件，全部刪除則設定為空物件
    )
  },
  down: async (queryInterface, Sequelize) => {
    // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
