const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: Category,
        raw: true,
        nest: true
      })
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      res.render('restaurants', { restaurants: data })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        raw: true,
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
