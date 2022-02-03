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
    return Restaurant.findByPk(id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant doesn\'t exist')
        res.render('restaurant', { restaurant })
      })
      .catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    console.log('hi getDashboard')
    res.render('restaurant-dashboard')
  }
}

exports = module.exports = restaurantController
