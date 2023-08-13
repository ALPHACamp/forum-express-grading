'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://obs.line-scdn.net/0hvfI0DxdQKUl0ST1GVq9WHkwfJThHLzNAVillKQNOdn5aZWpNG3t6KlJKJGUKfmsaVCdge1FAJH1dLjxKGw/w1200'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
