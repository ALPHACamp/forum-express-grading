"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Restaurants", "view_counts", {
      type: Sequelize.INTEGER,
      allowNull: null,
      defaultValue: 0,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Restaurants", "view_counts");
  },
};
