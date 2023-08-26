'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Restaurants',
          key: 'id'
        }
      },
      created_at: { // 修正
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: { // 修正
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Likes');
  }
};