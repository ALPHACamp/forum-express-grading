const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', {
          restaurant
        })
      })
      .catch(err => next(err))
  },
  // 新增一個新的 function 叫做  getDashboard
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      // 去資料庫用 id 找一筆資料
      include: Category,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant: restaurant.toJSON() // 把關聯資料轉成 JSON
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
