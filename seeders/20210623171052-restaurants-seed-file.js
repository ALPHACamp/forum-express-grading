'use strict'

const faker = require('faker')



module.exports = {
  up: async (queryInterface, Sequelize) => { 
  const restaurantArr = Array.from({ length: 50 }).map((d, i) => ({
    name: faker.name.findName(),
    tel: faker.phone.phoneNumber(),
    address: faker.address.streetAddress(),
    opening_hours: '08:00',
    image: `https://loremflickr.com/320/240/restaurant,food/?random=${i}`,
    description: faker.lorem.text(),
    createdAt: new Date(),
    updatedAt: new Date(),
    CategoryId: Math.floor(Math.random() * 6) * 10 + 1
  }))
  await queryInterface.bulkInsert( 'Restaurants', restaurantArr , {}) },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', null, {})
  }
};
