'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories',
      ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']
        .map((item, index) =>
          ({
            id: index * 10 + 1,
            name: item,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ), {})
  },
//這是考慮到遠端佈署時會使用 clearDB，而 clearDB 的 id 跳號採用了有間隔的設計。
//因此在計算資料 id 時，原則採用和遠端資料庫 clearDB 一致的設計，也就是每次跳號的間隔為 10。
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
  }
}
