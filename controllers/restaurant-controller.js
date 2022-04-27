const { Restaurant, Category } = require('../models/')

const restaurantController = {
  getRestaurants: (req, res, next) => {
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
        return res.render('restaurants', {
          restaurants: data
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', { restaurant: restaurant.toJSON() })
        return restaurant.increment('view_counts')
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant did't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
