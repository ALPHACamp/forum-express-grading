'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id, is_admin FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const normalUsers = users.filter(user => !user.is_admin)
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 10 }, () => ({
        text: faker.lorem.text().substring(0, 10),
        created_at: new Date(),
        updated_at: new Date(),
        user_id: normalUsers[Math.floor(Math.random() * (normalUsers.length - 1))].id, // make last user have no comment
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
