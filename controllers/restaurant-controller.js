const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      // 整理出想要的餐廳資訊
      const data = restaurants.map(restaurant => ({
        ...restaurant,
        description: restaurant.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  }
}
module.exports = restaurantController
