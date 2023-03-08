'use strict';
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
		const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
		const users = await queryInterface.sequelize.query('SELECT id FROM Users;', { type: queryInterface.sequelize.QueryTypes.SELECT })
		await queryInterface.bulkInsert('Comments', Array.from({length: 10}, () => ({
			text: faker.lorem.text(20),
			created_at: new Date(),
      updated_at: new Date(),
      restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
			user_id: users[Math.floor(Math.random() * users.length)].id
		})))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {});
  }
};
