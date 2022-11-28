// npx sequelize db:seed:undo:all & npx sequelize db:seed:all
"use strict";
const faker = require("faker");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先去查詢現在 Categories 的 id 有哪些，例如heroku的id生成是[5,15,25...]，而不是像本地順號[1,2,3...]
    const categories = await queryInterface.sequelize.query(
      "SELECT id FROM Categories;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    await queryInterface.bulkInsert(
      "Restaurants",
      // 等同 [,,,,,,...50個].map(()=>...)
      Array.from({ length: 50 }, () => ({
        name: faker.name.findName(),
        tel: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        opening_hours: "08:00",
        image: `https://loremflickr.com/320/240/restaurant,food/?random=${
          Math.random() * 100
        }`,
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        //所以用index再去對應，例如cats[1]=15
        //db:seed:all的話，會按照檔名順序執行，因為rest要引用到cat id，所以cat要在前面先執行
        category_id:
          categories[Math.floor(Math.random() * categories.length)].id,
      }))
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Restaurants", {});
  },
};
