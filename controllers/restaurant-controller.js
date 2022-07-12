const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res) => {
    const restaurants = await Restaurant.findAll({
      raw: true,
      nest: true,
      include: Category
    })
    const data = restaurants.map(r => ({
      ...r,
      description: r.description.substring(0, 50)
    }))
    res.render('restaurants', { restaurants: data })
  }
}
module.exports = restaurantController
