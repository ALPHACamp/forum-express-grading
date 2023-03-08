'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const defaultImage = 'https://inews.gtimg.com/newsapp_bt/0/14664808285/1000.jpg'
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: defaultImage
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
