const { Restaurants } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurants.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  }
}

module.exports = adminController
