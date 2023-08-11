'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments', [{
      text: faker.lorem.sentences(2),
      user_id: 1,
      restaurant_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      text: faker.lorem.sentences(2),
      user_id: 1,
      restaurant_id: 3,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      text: faker.lorem.sentences(2),
      user_id: 1,
      restaurant_id: 5,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      text: faker.lorem.sentences(2),
      user_id: 1,
      restaurant_id: 7,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      text: faker.lorem.sentences(2),
      user_id: 2,
      restaurant_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      text: faker.lorem.sentences(2),
      user_id: 2,
      restaurant_id: 4,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
