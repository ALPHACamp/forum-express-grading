const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: async (req, res) => {
    const restaurants = await Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    })
    const data = restaurants.map(r => ({
      ...r,
      description: r.description.substring(0, 50)
    }))
    return res.render('restaurants', {
      restaurants: data
    })
  }
}
module.exports = restaurantController
