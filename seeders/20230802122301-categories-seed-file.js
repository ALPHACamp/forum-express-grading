'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories',
      ['Chinese', 'Japanese', 'Italian', 'Mexican', 'vegetarian', 'American', 'Complex']
        .map(item => {
          return {
            name: item,
            created_at: new Date(),
            updated_at: new Date()
          }
        }
        ), {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', {})
  }
}
