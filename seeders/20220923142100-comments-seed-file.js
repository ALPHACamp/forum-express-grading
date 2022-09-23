'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const commentText = ['Not bad for me.', 'Good restaurant.', 'Not recommended.', 'Greatest in town!']
    const user = await queryInterface.sequelize.query(
      'SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurant = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;', { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 10 }, () => ({
        text: commentText[Math.floor(Math.random() * commentText.length)],
        user_id: user[Math.floor(Math.random() * user.length)].id,
        restaurant_id: restaurant[Math.floor(Math.random() * restaurant.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
