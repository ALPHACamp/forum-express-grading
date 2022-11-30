'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
        // reference: {
        //   model: 'Users',
        //   key: 'id'
        // }
      },
      restaurant_id: {
        type: Sequelize.INTEGER
        // reference: {
        //   model: 'Restaurant',
        //   key: 'id'
        // }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comments')
  }
}
