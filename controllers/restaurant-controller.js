const { Restaurant, Category } = require('../models')

module.exports = {
  async getRestaurants (_req, res, next) {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        include: Category,
        nest: true
      })

      res.render('restaurants', {
        restaurants: restaurants.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50)
        }))
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
