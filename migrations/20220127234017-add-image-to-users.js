'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING
    })
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'image')
  }
}
