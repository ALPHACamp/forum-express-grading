const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: [Category],
        nest: true,
        raw: true
      })
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50) // show only first 50 characters
      }))
      return res.render('restaurants', {
        restaurants: data
      }) // go to restaurants.hbs
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [Category], // 拿出關聯的 Category model
        nest: true,
        raw: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!") // didnot find a restaurant
      return res.render('restaurant', {
        restaurant
      })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = restaurantController
