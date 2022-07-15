'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // operate db directly with sequelize, each string won't be turn into snake_case
    // queryInterface.addColumn('table name', 'added column name', attribute, { after: 'column name' })
    await queryInterface.addColumn('Users', 'is_admin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'is_admin')
  }
}
