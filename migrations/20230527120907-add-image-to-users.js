'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', { // 在restaurants新增category_id欄位
      type: Sequelize.STRING,
      defaultValue: 'http://randomuser.me/api/portraits/women/26.jpg'
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
