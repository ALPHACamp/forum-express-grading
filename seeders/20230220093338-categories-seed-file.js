'use strict'
const categories = require('../seedersData/category')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories',
      categories.map(item => {
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
