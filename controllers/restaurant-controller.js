const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}

module.exports = restaurantController
