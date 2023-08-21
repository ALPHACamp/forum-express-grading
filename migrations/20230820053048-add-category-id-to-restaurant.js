// 刪除時設置99 失敗的功能
// 'use strict'

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.addColumn('Restaurants', 'category_id', {
//       type: Sequelize.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'Categories',
//         key: 'id'
//       },
//       onDelete: 'SET NULL' // 設置為id=99 '已刪除分類'
//     })
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.removeColumn('Restaurants', 'category_id')
//   }
// }

// 教案做法 備用

'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'category_id')
  }
}
