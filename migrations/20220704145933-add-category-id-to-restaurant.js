'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    })

    // await queryInterface.sequelize.query('UPDATE Restaurants SET category_id = 1')

    // await queryInterface.changeColumn('Restaurants', 'category_id', {
    //  type: Sequelize.INTEGER,
    //  defaultValue: 1,
    //  allowNull: false
    // })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'category_id')
  }
}
