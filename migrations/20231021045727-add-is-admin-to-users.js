'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'is_admin', {
      // 在這裡使用了is_admin而不使用isAdmin的原因是這裡是直接與資料庫做操作因此使用了資料庫語法
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'is_admin')
  }
}
