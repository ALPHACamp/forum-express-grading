'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', {
<<<<<<< HEAD
      type: Sequelize.STRING
=======
      type: Sequelize.STRING,
      allowNull: true
>>>>>>> R03
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
