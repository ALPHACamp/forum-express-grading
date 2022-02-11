const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurants => {
        const data = restaurants.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category, nest: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        // 當按下頁面重新整理時，Cache-Control 就會出現，以此作為判斷避免觀看數+1
        const cacheControl = req.rawHeaders.includes('Cache-Control')
        return !cacheControl ? restaurant.update({ viewCounts: restaurant.viewCounts + 1 }) : restaurant
      })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category, raw: true, nest: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
