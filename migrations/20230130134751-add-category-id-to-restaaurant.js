'use strict';

module.exports = {
  // Thinking 在Category and restaurants是一對多，所以要想在restaurant部分加個foreign key並去抓取Category這個id
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'category_id', {
      // note type的部分要跟你原先的資料表設定一樣，如Category是設定Id用INTEGER，若是使用name則是要修正成STRING。allowNull =>是否允許空值存在
      type: Sequelize.INTEGER,
      allowNull: false,
      // note references使用哪個table，用哪個field當作foreign key
      references: {
        model: 'Categories',
        key: 'id'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'category_id')
  }
};
