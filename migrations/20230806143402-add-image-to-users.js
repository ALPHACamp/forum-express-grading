'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
