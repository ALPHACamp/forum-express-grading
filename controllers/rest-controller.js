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
  }
}
module.exports = restaurantController
