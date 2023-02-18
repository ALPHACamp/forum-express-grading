'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'id', {
      autoIncrement: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'id', {
      autoIncrement: true,
      type: Sequelize.INTEGER
    })
  }
}
