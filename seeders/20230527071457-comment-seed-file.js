"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Comments",
      [
        {
          id: "1",
          text: "我覺得挺好吃，就是西瓜汁不大甜",
          user_id: "1",
          restaurant_id: "1",
          created_at: "2023-05-22 15:36:18",
          updated_at: "2023-05-27 08:09:15",
        },
        {
          id: "2",
          text: "豪吃",
          user_id: "1",
          restaurant_id: "2",
          created_at: "2023-05-22 15:36:18",
          updated_at: "2023-05-27 08:09:15",
        },
        {
          id: "3",
          text: "不豪吃",
          user_id: "1",
          restaurant_id: "3",
          created_at: "2023-05-22 15:36:18",
          updated_at: "2023-05-27 08:09:15",
        },
        {
          id: "4",
          text: "燈好黑",
          user_id: "1",
          restaurant_id: "7",
          created_at: "2023-05-22 15:36:18",
          updated_at: "2023-05-27 08:09:15",
        },
        {
          id: "5",
          text: "牆壁好白",
          user_id: "2",
          restaurant_id: "2",
          created_at: "2023-05-22 15:36:18",
          updated_at: "2023-05-27 08:09:15",
        },
        {
          id: "6",
          text: "老闆好兇",
          user_id: "2",
          restaurant_id: "3",
          created_at: "2023-05-22 15:36:18",
          updated_at: "2023-05-27 08:09:15",
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    // 清空資料表中所有資料
    await queryInterface.bulkDelete("Comments", {});
  },
};
