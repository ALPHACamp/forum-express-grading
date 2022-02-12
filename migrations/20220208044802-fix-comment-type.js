'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Comments', 'text', {
      type: Sequelize.TEXT,
      allowNull: false
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Comments', 'text')
    await queryInterface.addColumn('Comments', 'text', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
}
