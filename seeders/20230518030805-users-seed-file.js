'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: true,
      name: 'admin',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/taiwan,girl,photo/?random=${Math.random() * 100}`
    }, {
      email: 'user1@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user1',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/taiwan,girl,photo/?random=${Math.random() * 100}`
    }, {
      email: 'user2@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user2',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/taiwan,girl,photo/?random=${Math.random() * 100}`
    }, {
      email: 'user3@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user3',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/taiwan,girl,photo/?random=${Math.random() * 100}`
    }, {
      email: 'user4@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user4',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/taiwan,girl,photo/?random=${Math.random() * 100}`
    }, {
      email: 'user5@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user5',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/taiwan,girl,photo/?random=${Math.random() * 100}`
    }, {
      email: 'user6@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user6',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/taiwan,girl,photo/?random=${Math.random() * 100}`
    }, {
      email: 'user7@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user7',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/taiwan,girl,photo/?random=${Math.random() * 100}`
    }, {
      email: 'user8@example.com',
      password: await bcrypt.hash('12345678', 10),
      is_admin: false,
      name: 'user8',
      created_at: new Date(),
      updated_at: new Date(),
      image: `https://loremflickr.com/320/240/taiwan,girl,photo/?random=${Math.random() * 100}`
    }, {
      email: '12@12',
      password: await bcrypt.hash('12', 10),
      is_admin: true,
      name: '12',
      created_at: new Date(),
      updated_at: new Date(),
      image: 'https://i.imgur.com/X5kBCWp.jpeg'
    }], {})
  },
  down: async (queryInterface, Sequelize) => { // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
