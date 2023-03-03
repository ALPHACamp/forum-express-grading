'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(// 選出三位seeder
      'SELECT * FROM Users LIMIT 3;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(// 對隨機前五家餐廳評論
      'SELECT id FROM Restaurants ORDER BY id ASC LIMIT 5',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    for (let i = 0; i < 3; i++) { // 每人隨機評論3次
      await queryInterface.bulkInsert('Comments',
        users.map(user => {
          return {
            text: `${user.name}'s comment`,
            user_id: user.id,
            restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
            created_at: new Date(),
            updated_at: new Date()
          }
        })
        , {})
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
