const { Restaurant, Category } = require('../models')

const restaruantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        next: true,
        include: Category
      })
      const data = restaurants.map(r => ({ ...r, description: r.description.substring(0, 50) }))
      res.render('restaurants', { restaurants: data })
    } catch (e) {
      next(e)
    }
  },
  getRestaurant: (req, res) => {
    return res.render('restaurants')
  }
}

module.exports = restaruantController
