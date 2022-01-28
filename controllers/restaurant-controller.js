const { Restaurant, Category, View } = require('../models')
const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      console.log(categoryId)
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAll({
          where: { ...categoryId ? { categoryId } : {} },
          include: Category,
          raw: true,
          nest: true
        }),
        Category.findAll({ raw: true })
      ])

      return res.render('restaurants', {
        restaurants,
        categories,
        categoryId
      })
    } catch (error) {
      next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restInstance = await Restaurant.findByPk(req.params.id, {
        include: Category
      })
      if (!restInstance) throw new Error("Restaurant didn't exist!")

      // Update view count on restaurant
      const restaurant = await restInstance.increment('view_counts')

      // Update view data
      await View.create({
        userId: req.user.id,
        restaurantId: req.params.id
      })

      return res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    } catch (error) {
      next(error)
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: Category })
      return res.render('dashboard', { restaurant })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
