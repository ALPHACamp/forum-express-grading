const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Can not find Restaurant!')
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error()
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
