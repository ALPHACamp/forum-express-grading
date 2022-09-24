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
      nest: true
    })
      .then(restaurant => restaurant.increment('viewCounts'))
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant = restaurant.toJSON()
        res.render('restaurant', {
          restaurant
        })
        // return restaurant.increment('viewCounts', { by: 1 })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
