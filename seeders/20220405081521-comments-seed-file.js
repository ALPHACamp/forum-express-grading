'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 20 }, () => ({
        text: 'test',
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
