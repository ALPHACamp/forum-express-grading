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
      res.render('restaurant', {
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
