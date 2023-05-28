'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://cdn-origin.cool-style.com.tw/cool/2015/03/The-Simpsons-Illustrated-in-Streetwear-05.jpg'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
