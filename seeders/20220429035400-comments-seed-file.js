'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', [{
      text: 'good drink.',
      user_id: '1',
      restaurant_id: '1',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      text: 'good eat.',
      user_id: '1',
      restaurant_id: '2',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
