'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      // todo: 沒有成功顯示隨機圖片, 改在seed裡面
      defaultValue: `https://loremflickr.com/320/240/people/?random=${Math.random() * 100}`
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
