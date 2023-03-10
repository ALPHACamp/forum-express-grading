const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        include: Category,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ]).then(([restaurants, categories]) => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data,
        categories
      })
    })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {

      include: Category
    }).then(restaurant => {
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      return restaurant.increment('viewCounts')
    }).then(restaurant => {
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant does not exist!')
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }

}
module.exports = restaurantController
