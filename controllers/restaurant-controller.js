const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurant => {
      const data = restaurant.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', { restaurants: data })
    })
  }
}
module.exports = restaurantController
