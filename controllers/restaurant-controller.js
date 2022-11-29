// restaurantController 是一個物件 (object)。
// restaurantController 有不同的方法，例如 getRestaurants
const { Restaurant, Category } = require("../models");
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true,
    }).then((restaurants) => {
      const data = restaurants.map((r) => ({
        ...r,
        description: r.description.substring(0, 50),
      }));
      return res.render("restaurants", {
        restaurants: data,
      });
    });
  },
};

// 匯出之後才能在其他檔案裡使用。
module.exports = restaurantController;
