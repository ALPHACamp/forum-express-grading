'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{ // 一次新增三筆資料
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'root',
      image: 'https://media.istockphoto.com/id/1344552674/vector/account-icon-profile-icon-vector-illustration.jpg?s=1024x1024&w=is&k=20&c=i_5sF8AFgX_ebEJgr05XbzHaofrB0-ujcmVM2XOHJSA=',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user1',
      image: 'https://media.istockphoto.com/id/1344552674/vector/account-icon-profile-icon-vector-illustration.jpg?s=1024x1024&w=is&k=20&c=i_5sF8AFgX_ebEJgr05XbzHaofrB0-ujcmVM2XOHJSA=',
      created_at: new Date(),
      updated_at: new Date()
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user2',
      image: 'https://media.istockphoto.com/id/1344552674/vector/account-icon-profile-icon-vector-illustration.jpg?s=1024x1024&w=is&k=20&c=i_5sF8AFgX_ebEJgr05XbzHaofrB0-ujcmVM2XOHJSA=',
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
