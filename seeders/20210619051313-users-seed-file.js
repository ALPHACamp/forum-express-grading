'use strict';
const bcrypt = require('bcryptjs')
module.exports = {
  up: async  (queryInterface, Sequelize) => {
  await queryInterface.bulkInsert('Users', [{
    email: 'root@example.com',
    password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
    isAdmin: true,
    name: 'root',
    registeredAt: new Date(),
    updatedAt: new Date()
  }, {
    email: 'user1@example.com',
    password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
    isAdmin: false,
    name: 'User1',
    registeredAt: new Date(),
    updatedAt: new Date()
  }, {
    email: 'user2@example.com',
    password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
    isAdmin: false,
    name: 'User2',
    registeredAt: new Date(),
    updatedAt: new Date()
  }], {})},

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {}) //第三個參數可以指定 where 條件
  }
};
