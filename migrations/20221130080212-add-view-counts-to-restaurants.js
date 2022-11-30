//npx sequelize migration:generate --name add-view-counts-to-restaurants
//npx sequelize db:migrate
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Restaurants", "view_counts", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Restaurants", "view_counts");
  },
};
