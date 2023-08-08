const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      const data = restaurants.map(restaurant =>
        ({
          ...restaurant,
          description: restaurant.description.substring(0, 50)
        }))
      return res.render('restaurants', { restaurants: data })
    })
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    console.log(req.params.id)
    Restaurant.findByPk(req.params.id, {
      nest: true,
      include: [Category]
    }).then(restaurant => {
      if (!restaurant) throw new Error('restaurant not found')

      restaurant.update({ viewCounts: restaurant.viewCounts + 1 })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    })
      .catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('restaurant not found')
        return res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(error => next(error))
  }
}
module.exports = restaurantController
