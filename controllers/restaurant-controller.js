const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        // 當 key 重複時，會以後面出現的為準
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  }
}
module.exports = restaurantController
