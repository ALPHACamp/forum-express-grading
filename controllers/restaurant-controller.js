const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [Category],
      nest: true,
      raw: true
    })
      .then(restaurants => {
        return restaurants.map(item => {
          item.description = item.description.substring(0, 50)
          return item
        })
      })
      .then(restaurants => res.render('restaurants', { restaurants }))
      .catch(err => next(err))
  }
}
module.exports = restaurantController
