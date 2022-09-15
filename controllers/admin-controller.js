const { Restaurant } = require('../models')
const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admins/restaurants', { restaurants }))
      .catch(err => next(err))
  }
}
module.exports = adminController
