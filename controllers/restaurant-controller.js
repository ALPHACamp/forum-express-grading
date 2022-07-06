const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(restaurant => {
        return {
          ...restaurant,
          description: restaurant.description.substring(0, 50)
        }
      })
      return res.render('restaurants', {
        restaurants: data
      })
    })
  }
}
module.exports = restaurantController
