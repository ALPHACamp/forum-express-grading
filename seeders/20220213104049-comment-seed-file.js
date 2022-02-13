'use strict'

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取得餐廳跟使用者資料
    const [restaurants, users] = await Promise.all([
      queryInterface.sequelize.query('SELECT * FROM Restaurants;', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }),
      queryInterface.sequelize.query('SELECT * FROM Users;', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
    ])

    // 每個測試帳號都有 20 筆隨機餐廳留言
    let data = users.map(user =>
      Array.from({ length: 20 }, () => ({
        text: faker.random.word(),
        user_id: user.id,
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: faker.date.recent(),
        updated_at: faker.date.recent()
      }))
    )
    // 展開後接入陣列中
    data = [].concat(...data)

    // 寫入種子
    await queryInterface.bulkInsert('Comments', data)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
