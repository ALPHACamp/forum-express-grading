'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Comments',
      ['薯條超讚', '冷凍包適合沒時間的人', '咖啡抹醬必須囤', '根本料理小天才', '環境很好', '手沖很棒', '節慶蛋糕太棒了吧', '麵包二訪還是一樣迷人']
        .map(item => ({
          text: item,
          user_id: users[Math.floor(Math.random() * users.length)].id,
          restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
          created_at: new Date(),
          updated_at: new Date()
        }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
