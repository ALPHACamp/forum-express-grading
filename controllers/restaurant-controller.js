const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      const [resData, categories] = await Promise.all([
        Restaurant.findAll({
          include: Category,
          where: {
            ...categoryId ? { categoryId } : {}
          },
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])
      const restaurants = resData.map(res => ({
        ...res,
        description: res.description.substring(0, 50)
      }))
      res.render('restaurants', { restaurants, categories, categoryId })
    } catch (err) { next(err) }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true
      })
      if (!restaurant) throw new Error('Restaurant does not exist!')
      await restaurant.increment('view_counts')
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) { next(err) }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      })
      if (!restaurant) throw new Error('Restaurant does not exist!')
      res.render('dashboard', { restaurant })
    } catch (err) { next(err) }
  }
}

module.exports = restaurantController
