'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png?w=900&t=st=1691556561~exp=1691557161~hmac=190d052de746a02e65d204169cece61782c093819e5d5b69607fa7c149c302ad'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
