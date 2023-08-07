const { Category, Restaurant } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: [Category],
      raw: true,
      nest: true
    })
      .then(restaurant => {
        const data = restaurant.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
  },

  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts', { by: 1 })
          .then(() => {
            const updatedRestaurant = restaurant.get({ plain: true })
            return res.render('restaurant', { restaurant: updatedRestaurant })
          })
      })
      .catch(err => next(err))
  },

  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category],
      raw: true,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
