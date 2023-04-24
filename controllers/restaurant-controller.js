const { Restaurant, User, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      restaurants.forEach(r => r = Object.assign(r, { description: r.description.substring(0, 50)}))
      res.render('restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true, include: [Category]})
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController