const { Restaurant, Category } = require('../models')

const restaurantsController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      include: Category,
      raw: true,
      nest: true
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
      .catch(error => next(error))
  },

  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant =>
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      )
      .catch(error => next(error))
  },

  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      raw: true,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(error => next(error))
  }
}

module.exports = restaurantsController
