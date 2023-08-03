const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        const data = restaurants.map(restaurant => (
          {
            ...restaurant,
            description: restaurant.description.substring(0, 50)
          }
        ))
        return res.render('restaurants', { restaurants: data })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      // raw: true, // 為向下傳遞結果並使用 increment 方法，拿掉資料格式整理
      // nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        return restaurant.increment('viewCounts')
      })
      .then(incrementResult => res.render('restaurant', { restaurant: incrementResult.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")

        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
