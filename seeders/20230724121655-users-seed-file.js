'use strict'
const bcrypt = require('bcryptjs')
const { sequelize } = require('../models')

const salt = bcrypt.genSaltSync(10)
const userSeed = [
  {
    id: 1,
    name: 'root',
    email: 'root@example.com',
    password: bcrypt.hashSync('12345678', salt),
    created_at: new Date(), // queryInterface要用snake case
    updated_at: new Date(),
    is_admin: true
  }, {
    id: 2,
    name: 'user1',
    email: 'user1@example.com',
    password: bcrypt.hashSync('12345678', salt),
    created_at: new Date(),
    updated_at: new Date(),
    is_admin: false
  }, {
    id: 3,
    name: 'user2',
    email: 'user2@example.com',
    password: bcrypt.hashSync('12345678', salt),
    created_at: new Date(),
    updated_at: new Date(),
    is_admin: false
  }]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /* 先把原本占id位的資料都刪掉 */
    await queryInterface.bulkDelete('Users', { id: userSeed.map(seed => seed.id) }, {})
    // 我們僅建立未存在的seeder，先找出沒建的在一次建起來
    const notExist = []
    for (const [index, newUser] of userSeed.entries()) {
      const existUser = await queryInterface.sequelize.query(
        // :email前後是單引號 Users, email前後是反引號 不然會噴錯
        "SELECT * FROM `Users` WHERE `email` = ':email'",
        { replacements: { email: newUser.email }, type: Sequelize.QueryTypes.SELECT }
      )
      if (!existUser.length) {
        // 如果不存在，把id放進nonExist
        notExist.push(index)
      }

      /* Seed建立後，id自動增加設成最後一個seed的id開始 */
      await queryInterface.sequelize.query(
        'ALTER TABLE `Users` AUTO_INCREMENT = :count',
        { replacements: { count: userSeed[userSeed.length - 1].id }, type: Sequelize.QueryTypes.ALTER })
    }

    // 用map找出notExist裡存的index
    await queryInterface.bulkInsert('Users', notExist.map(x => userSeed[x]), {})
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op // 可以用邏輯運算像是or
    const seedEmails = userSeed.map(user => user.email) // 取出所有seed的email
    // 第二格放where,放入刪除條件，這邊只刪掉seeder裡的seed
    await queryInterface.bulkDelete('Users', { email: { [Op.in]: seedEmails } }, {})
  }
}
