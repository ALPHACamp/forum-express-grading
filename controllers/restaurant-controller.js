const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [Category],
      nest: true,
      raw: true
    })
      .then(restaurants => {
        return restaurants.map(item => {
          item.description = item.description.substring(0, 50)
          return item
        })
      })
      .then(restaurants => res.render('restaurants', { restaurants }))
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurants didn't exist!")
        return Promise.all([
          restaurant.increment('viewCounts', { by: 1 }),
          res.render('restaurant', { restaurant: restaurant.toJSON() })
        ])
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category],
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurants didn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
