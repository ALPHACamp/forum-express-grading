const assert = require('assert')
const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findAll({
        include: Category,
        where: { ...(categoryId ? { categoryId } : {}) },
        nest: true,
        raw: true
      })
    ])
      .then(([categories, restaurants]) => {
        if (!restaurants.length) {
          return req.flash('error_messages', 'No restaurant is found!')
        }
        const datas = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        res.render('restaurants', {
          restaurants: datas,
          categories,
          categoryId
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category
    })
      .then(restaurant => {
        assert(restaurant, "Restaurant did't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant =>
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      )
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        assert(restaurant, "Restaurant did't exist!")
        res.render('dashboard', {
          restaurant
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
