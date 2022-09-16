// const db = require('../models')
// const Restaurant = db.Restaurant
const { Restaurant } = require('../models') // 跟上面是一樣的概念

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  }
}
module.exports = adminController
