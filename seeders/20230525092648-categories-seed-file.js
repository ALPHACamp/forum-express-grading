'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', // bulkInsert批次匯入
      ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
        .map(item => {
          return {
            name: item, // name用map依序帶入
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
