const { Restaurant, Category, User } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    // res.render('restaurants')
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      })))
      .then(restaurants => res.render('restaurants', { restaurants }))
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant doesn\'t exist')
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => res.render('restaurant', {
        restaurant: restaurant.toJSON()
      }))
      .catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant doesn\'t exist')
        res.render('restaurant-dashboard', { restaurant })
      })
  }
}

exports = module.exports = restaurantController
