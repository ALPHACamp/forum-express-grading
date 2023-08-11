const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({ raw: true, next: true, include: Category }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', { restaurants: data })
    })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params
    return Promise.all([
      Restaurant.findByPk(id, { raw: true, nest: true, include: Category }),
      Restaurant.increment({ view_counts: 1 }, { where: { id } })
    ])
      .then(([restaurant, viewCounts]) => {
        if (!restaurant) throw new Error('Restaurant didnt exist!')
        return res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, { raw: true, nest: true, include: Category }).then(restaurant => {
      if (!restaurant) throw new Error('Restaurant didnt exist!')
      return res.render('dashboard', { restaurant })
    })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
