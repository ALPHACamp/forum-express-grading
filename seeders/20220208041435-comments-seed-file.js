'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [users, restaurants] = await Promise.all([
      queryInterface.sequelize.query(
        'SELECT id, email FROM Users;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      ),
      queryInterface.sequelize.query(
        'SELECT id FROM Restaurants;',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      )
    ])
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 100 }, () => ({
        text: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        user_id: users[Math.floor(Math.random() * (users.length - 1))].id //測試一個user無評論情形
      })), {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
