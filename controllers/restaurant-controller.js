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
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
    })
      .then((restaurant) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!");
        return restaurant.increment("viewCounts", { by: 1 }); //小寫restaurant
      })
      .then((restaurant) => {
        // console.log(restaurant,restaurant.toJSON());
        res.render("restaurant", {
          restaurant: restaurant.toJSON(), //toJSON大小寫要全對
        });
      })
      .catch((err) => next(err));
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
      nest: true,
      raw: true,
    })
      .then((restaurant) => {
        // console.log(restaurant);
        if (!restaurant) throw new Error("Restaurant doesn't exist!");
        res.render("dashboard", {
          restaurant,
        });
      })
      .catch((err) => next(err));
  },
};

// 匯出之後才能在其他檔案裡使用。
module.exports = restaurantController;
