const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    console.log(Restaurant)
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  }
}
module.exports = adminController
