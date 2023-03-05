'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://loremflickr.com/320/240/person'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
