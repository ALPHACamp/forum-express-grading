'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 把Categories清乾淨再產生新的category
    // 但是清空Categories之前要先清空關聯的子資料restaurant
    await queryInterface.bulkDelete('Restaurants', null, {})
    await queryInterface.bulkDelete('Categories', null, {})

    await queryInterface.bulkInsert('Categories', ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
      .map(name => {
        return {
          name,
          created_at: new Date(),
          updated_at: new Date()
        }
      }), {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
}
