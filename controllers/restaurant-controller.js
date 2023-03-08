const { Restaurant, Category } = require('../models')
const sessionCheck = []

const restaurantController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({
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
    return Restaurant.findByPk(req.params.id, {
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        // check repeat
        const user = req.session.passport.user
        const restaurantId = restaurant.toJSON().id
        if (sessionCheck.some(item => item === `${user}:${restaurantId}`)) {
          return restaurant
        }
        sessionCheck.push(`${user}:${restaurantId}`)
        return restaurant.increment({ viewCount: 1 })
      })
      .then(restaurant => {
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
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
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
