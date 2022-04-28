'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING

    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'image')
  }
}
