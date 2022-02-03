const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant
      .findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        restaurants = restaurants.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant
      .findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => res.render('restaurant', { restaurant }))
      .catch(err => next(err))
  }
}
module.exports = restaurantController
