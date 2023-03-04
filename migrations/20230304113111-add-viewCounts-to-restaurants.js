'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Restaurants', 'view_counts', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Restaurants', 'view_counts')
  }
}
