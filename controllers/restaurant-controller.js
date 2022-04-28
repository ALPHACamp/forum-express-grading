const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      raw: true,
      nest: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r, description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', { restaurants: data })
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category, nest: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        restaurant.increment('viewCount')
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('dashboard', { restaurant })
      })
  }
}
module.exports = restaurantController
