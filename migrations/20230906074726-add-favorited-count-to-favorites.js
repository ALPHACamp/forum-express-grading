'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Favorites', 'favoritedCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0, // 根據需求調整默認值
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Favorites', 'favoritedCount');
  },
};