const { Category, Restaurant } = require('../models')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: Category,
      raw: true,
      nest: true
    })
      .then(restaurants => {
        // map後的()是IIFE嗎？
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, { include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
        restaurant.increment('viewCounts')
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, { include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
