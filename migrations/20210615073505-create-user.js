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
        type: Sequelize.STRING,
        allowNull: false,
        is: /[\w\d\S]/s,
        defaultValue: 'random'
      },
      email: {
        type: Sequelize.STRING,
        unique:true,
        allowNull: false,
        defaultValue: 'random@randommail.com'
      },
      password: {
        type: Sequelize.STRING,
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