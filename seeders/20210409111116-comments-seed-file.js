'use strict';

const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      [{
        text: faker.lorem.text().substring(0, 50),
        UserId: 1,
        RestaurantId: Math.floor(Math.random() * 50 + 1),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: faker.lorem.text().substring(0, 50),
        UserId: 2,
        RestaurantId: Math.floor(Math.random() * 50 + 1),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        text: faker.lorem.text().substring(0, 50),
        UserId: 3,
        RestaurantId: Math.floor(Math.random() * 50 + 1),
        createdAt: new Date(),
        updatedAt: new Date()
      }], {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
