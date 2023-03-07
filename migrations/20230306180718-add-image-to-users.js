'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://images.squarespace-cdn.com/content/v1/528252b7e4b00150d03a4848/1503802784774-N1DQMHKRAUCNCWGQN31X/RickAndMorty_RickHappy1500.png?format=500w'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
