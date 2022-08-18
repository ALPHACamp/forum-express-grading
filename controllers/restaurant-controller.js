const { Restaurant, Category } = require('../models')

const restaurantController = {
  // show all restaurants with 'category name'
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      restaurants = restaurants.map(restaurant => {
        if (restaurant.description.length >= 50) {
          restaurant.description = restaurant.description.substring(0, 47) + '...'
        }
        return restaurant
      })
      return res.render('restaurants', { restaurants })
    }).catch(e => next(e))
  },

  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    }).then(restaurant => {
      if (!restaurant) throw new Error("Restaurant doesn't exist!")
      res.render('restaurant', { restaurant })
    }).catch(e => next(e))
  }
}
module.exports = restaurantController
