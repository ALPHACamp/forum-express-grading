const { Restaurant, Category } = require('../models')

module.exports = {
  async getRestaurants (req, res, next) {
    try {
      const categoryId = Number(req.query.categoryId) || ''
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAll({
          where: {
            ...categoryId ? { categoryId } : {}
          },
          raw: true,
          include: Category,
          nest: true
        }),
        Category.findAll({ raw: true })
      ])

      res.render('restaurants', {
        restaurants: restaurants.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50)
        })),
        categories,
        categoryId
      })
    } catch (err) {
      next(err)
    }
  },
  async getRestaurant (req, res, next) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category })

      await restaurant.increment('viewCounts')
      res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    } catch (err) {
      next(err)
    }
  },
  async getDashboard (req, res, next) {
    try {
      res.render('dashboard', {
        restaurant: await Restaurant.findByPk(req.params.id, {
          raw: true,
          include: Category,
          nest: true
        })
      })
    } catch (err) {
      next(err)
    }
  }
}
