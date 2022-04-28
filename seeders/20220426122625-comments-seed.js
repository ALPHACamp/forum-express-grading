'use strict'
const faker = require('faker')
// const queryString = process.env.NODE_ENV === 'production' ? 'SELECT id FROM public."Categories";' : 'SELECT id FROM Categories;'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
    const categories = await queryInterface.sequelize.query(
      queryString,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    */
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 500 }, (value, index) => ({
        user_id: 1,
        restaurant_id: index % 50 + 1,
        text: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
}
