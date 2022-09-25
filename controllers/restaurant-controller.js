const { Restaurant, Category } = require('../models')
const restaurant = require('../models/restaurant')
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
      return res.render('restaurants', { restaurants: data })
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        Restaurant.increment('viewCounts', { where: { id: req.params.id } })
        return restaurant
      })
      .then(restaurant => {
        return res.render('restaurant', {
          restaurant
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurantInside => {
        const restaurantOut = {}
        restaurantOut.restaurant = restaurantInside
        return res.render('dashboard', restaurantOut)
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
