'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Replace_this_image_male.svg/480px-Replace_this_image_male.svg.png'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
