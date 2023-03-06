'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [users, restaurants] = await Promise.all([
      queryInterface.sequelize.query('SELECT id FROM Users', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }),
      queryInterface.sequelize.query('SELECT id FROM Restaurants', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
    ])
    // -傳入 type 物件，標明是 SELECT query，
    // -使回傳值不包含 metadata，
    // -為單純的 SELECT 結果集( an array of results )
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 10 }, (_, index) => ({
        text: `quick commet ${index + 1} from seeder`,
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id:
          restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
