'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const defaultImage = 'https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg'
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: defaultImage
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
