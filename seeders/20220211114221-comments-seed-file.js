'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Comments',
      ['好吃', '氣氛好', '老闆親切']
        .map(item => {
          return {
            text: item,
            created_at: new Date(),
            updated_at: new Date(),
            user_id: users[Math.floor(Math.random() * users.length)].id,
            restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id
          }
        }
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
