const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true, include: Category, nest: true })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error('查無此餐廳')
        restaurant.increment('viewCounts', { by: 1 })
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { raw: true, nest: true })
      .then(restaurant => {
        res.render('dashboard', { restaurant })
      })
  }
}

module.exports = restaurantController
