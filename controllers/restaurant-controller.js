const { Restaurant, Category, User } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    const where = {}
    if (categoryId) where.categoryId = categoryId

    return Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findAll({ raw: true, nest: true, where, include: [Category] })
    ])
      .then(([categories, restaurants]) => {
        restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants, categories, categoryId })
      })
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant doesn\'t exist')
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => res.render('restaurant', {
        restaurant: restaurant.toJSON()
      }))
      .catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant doesn\'t exist')
        res.render('dashboard', { restaurant })
      })
  }
}

exports = module.exports = restaurantController
