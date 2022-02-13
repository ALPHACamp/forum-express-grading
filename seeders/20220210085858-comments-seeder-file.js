'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先查詢現在 Users 的 id 有哪些
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Comments', [{
      text: '看起來好好吃!',
      user_id: users[Math.floor(Math.random() * users.length)].id,
      restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      text: '真香!',
      user_id: users[Math.floor(Math.random() * users.length)].id,
      restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      text: '香噴噴!!',
      user_id: users[Math.floor(Math.random() * users.length)].id,
      restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
