'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const DEFAULT_AVATAR = '/images/mark_mitsu.png'
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: DEFAULT_AVATAR
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
