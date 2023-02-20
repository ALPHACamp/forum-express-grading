const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurant => res.render('admin/restaurants', { restaurant }))
      .catch(err => next(err))
  }
}

module.exports = adminController
