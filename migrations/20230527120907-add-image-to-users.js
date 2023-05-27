'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', { // 在restaurants新增category_id欄位
      type: Sequelize.STRING
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
