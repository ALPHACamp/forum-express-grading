'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants LIMIT 3;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const SEED_COMMENTS = ['Good!', 'Tasty!', 'Delicious!', 'Not really good.']

    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 10 }, () => ({
        text: SEED_COMMENTS[Math.floor(Math.random() * SEED_COMMENTS.length)],
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
