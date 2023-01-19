'use strict';
// note 專門使用假資料的套件
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
        updated_at: new Date()
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Restaurants', {})
  }
};
