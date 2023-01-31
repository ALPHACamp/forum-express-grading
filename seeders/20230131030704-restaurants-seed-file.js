'use strict';
// note 專門使用假資料的套件
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thinking 在部署後，Categories對於每個廠牌的資料庫id產生的方式不一樣，所以要先查找該資料庫的Categories的id後再去做隨機分配
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;', { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert('Restaurants',
    //  note 下面等同於Array.from({ XXX }).map(() => ({ XXX }))
      Array.from({ length: 50 }, () => ({
        name: faker.name.fullName(),
        tel: faker.phone.number(),
        address: faker.address.streetAddress(),
        opening_hours: '8:00',
        //  note 圖片生成可以修改restaurant,food換成其他想要的主題名稱即可
        // note 採用math.radom是為了不要產出相同的圖片,使用loremflickr的網站較為穩定
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${Math.random() * 100}`,
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        // note 配合部署後的Categories產生的id, 找到後為一陣列值，隨機取其中一個index作為他的id value
        category_id: categories[Math.floor(Math.random() * categories.length)].id
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
};
