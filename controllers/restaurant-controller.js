const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant doesn't exist!")
      await restaurant.increment('viewCounts', { by: 1 })
      res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    } catch (err) {
      next(err)
    }
  },

  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category],
      nest: true
    }).then(restaurant => {
      if (!restaurant) throw new Error("Restaurant doesn't exist!")
      res.render('dashboard', { restaurant: restaurant.toJSON() })
    }).catch(err => next(err))
  }
}
module.exports = restaurantController
