'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        is: /[\w\d\S]/s,
        defaultValue: 'random'
      },
      email: {
        type: Sequelize.STRING(127),
        unique:true,
        allowNull: false,
        defaultValue: 'random@randommail.com'
      },
      password: {
        type: Sequelize.STRING(200),
        allowNull: false,
        defaultValue: 'random'
      },
      registeredAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};