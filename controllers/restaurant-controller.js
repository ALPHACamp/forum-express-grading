const { Restaurant, User, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      const [restaurants, categories] = await Promise.all([Restaurant.findAll({ raw: true, nest: true, include: [Category], where: { ...categoryId ? { categoryId } : null } }), Category.findAll({ raw: true })]) 
      restaurants.forEach(r => r = Object.assign(r, { description: r.description.substring(0, 50)}))
      res.render('restaurants', { restaurants, categories, categoryId })
    } catch (err) {
      next(err)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { nest: true, include: [Category]})
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('viewCounts')
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { nest: true, include: [Category] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController