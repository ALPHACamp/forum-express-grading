'use strict'
const dayjs = require('dayjs')
const dayjsRandom = require('dayjs-random')
const faker = require('faker')

dayjs.extend(dayjsRandom)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 獲取 User 表單資料
    const user = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 獲取 Restaurant 表單資料
    const restaurant = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    queryInterface.bulkInsert('Comments', Array.from({ length: 100 }, () => ({
      text: faker.lorem.text(),
      restaurant_id: restaurant[[Math.floor(Math.random() * restaurant.length)]].id,
      user_id: user[Math.floor(Math.random() * user.length)].id,
      created_at: dayjs.between('2022-08-23', '2022-09-23').format('YYYY-MM-DD HH:MM:ss'),
      updated_at: new Date()
    })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
