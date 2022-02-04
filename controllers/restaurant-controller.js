const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findAll({
        where: {
          ...categoryId ? { categoryId } : {}
        },
        raw: true,
        nest: true,
        include: [Category]
      })
    ])
      .then(([categories, restaurants]) => {
        restaurants = restaurants.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          categories,
          restaurants,
          categoryId
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant
      .findByPk(req.params.id, { nest: true, include: [Category] })
      .then(restaurant => restaurant.increment('viewCounts'))
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant
      .findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => res.render('dashboard', { restaurant }))
      .catch(err => next(err))
  }
}
module.exports = restaurantController
