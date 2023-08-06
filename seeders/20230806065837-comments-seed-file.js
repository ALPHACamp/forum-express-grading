'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT `id`, `name` FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const restaurants = await queryInterface.sequelize.query(
      'SELECT `id` FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const commentSeed = []
    for (const restaurant of restaurants) {
      for (const user of users) {
        commentSeed.push(
          {
            text: `test-comment: ${user.name} - restaurant ${restaurant.id}`,
            user_id: user.id,
            restaurant_id: restaurant.id,
            created_at: new Date(),
            updated_at: new Date()
          }
        )
      }
    }
    await queryInterface.bulkInsert('Comments', commentSeed, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
