'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'https://i.imgur.com/JsBK4YE.jpeg'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
