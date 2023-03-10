'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 新增以下6行，先去查詢現在 id 有哪些
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants ORDER BY id ASC;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    console.log(restaurants)

    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 50 }, () => ({
        text: faker.lorem.text(),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id: restaurants[Math.floor(Math.random() * 10)].id, // 僅在前十間餐廳產生 comments，但 restaurant 回傳的順序不定呀
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
