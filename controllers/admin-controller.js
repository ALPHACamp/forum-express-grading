const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurant => {
        return res.render('admin/restaurants', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
