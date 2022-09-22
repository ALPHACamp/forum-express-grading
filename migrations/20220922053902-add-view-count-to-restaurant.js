'use strict'
const { Restaurant } = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Restaurant.queryInterface.addColumn('Restaurants', 'view_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0 // 因為不允許空值，所以這邊就要先設定預設值，或最後再執行此 migration 就不用設定 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    Restaurant.queryInterface.removeColumn('Restaurant', 'view_count')
  }
}
