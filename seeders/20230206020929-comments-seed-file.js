'use strict';
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thinking Comment牽涉到兩個table, 所以要兩個talbe都要去查找，然後個別設計隨機id以及假文字
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;', { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 200 }, () => ({
        text: faker.lorem.sentence(),
        user_id: users[Math.floor(Math.random() * users.length)].id, // user random index
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id, // restaurant random index
        created_at: new Date(),
        updated_at: new Date()
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
};
