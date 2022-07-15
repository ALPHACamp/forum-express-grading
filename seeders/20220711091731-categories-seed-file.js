'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 獨立寫成 CATEGORIES，資料量大時可以拉出去變成一個獨立檔案
    const CATEGORIES = ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理']

    await queryInterface.bulkInsert(
      'Categories',
      CATEGORIES.map((item) => {
        return {
          name: item,
          created_at: new Date(),
          updated_at: new Date(),
        }
      }),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', {})
  },
}
