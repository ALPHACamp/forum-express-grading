'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://i.imgur.com/kHCNQuX.jpeg'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'image')
  }
}
