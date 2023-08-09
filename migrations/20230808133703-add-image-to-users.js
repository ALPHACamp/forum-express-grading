'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'https://loremflickr.com/240/320/person'
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'image')
  }
}
