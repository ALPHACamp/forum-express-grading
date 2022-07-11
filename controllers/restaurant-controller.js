const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAll({
          include: [Category],
          where: {
            ...categoryId ? { categoryId } : {}
          },
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])

      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50) // show only first 50 characters
      }))
      return res.render('restaurants', { // go to restaurants.hbs
        restaurants: data,
        categories,
        categoryId
      })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      let restaurant = await Restaurant.findByPk(req.params.rest_id, {
        include: [Category],
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!") // didnot find a restaurant
      await restaurant.increment('viewCounts', { by: 1 })
      restaurant = restaurant.toJSON()
      return res.render('restaurant', {
        restaurant
      })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.rest_id, {
        include: [Category],
        nest: true,
        raw: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!") // didnot find a restaurant
      return res.render('dashboard', {
        restaurant
      })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = restaurantController
