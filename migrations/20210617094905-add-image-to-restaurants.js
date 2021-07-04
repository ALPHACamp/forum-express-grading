'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Restaurants', 'image', {
      type: Sequelize.STRING,
      defaultValue: "/upload/pic-replacement.jpg"
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'image');
  }
};
