'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', ['中式料理', '日式料理', '義式料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
      .map(item => {
        return {
          name: item,
          created_at: new Date(),
          updated_at: new Date()
        }
      }), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {})
  }
}
