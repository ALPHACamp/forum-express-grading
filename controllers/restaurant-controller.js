const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50) + '...'
        }))

        return res.render('restaurants', {
          restaurants: data
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
