const { Restaurant } = require('../models')
const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
    return res.render('admin/restaurants')
  }
}
module.exports = adminController
