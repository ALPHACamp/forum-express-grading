'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'avatar', { type: Sequelize.STRING })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'avatar', {})
  }
}
