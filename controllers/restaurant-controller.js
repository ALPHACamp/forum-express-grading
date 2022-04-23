const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      include: Category,
      nest: true
    }).then(restaurants => {
      const data = restaurants.map(r => {
        return { ...r, description: r.description.substring(0, 50) }
      })
      // console.log(data) // [{...},{...}]
      return res.render('restaurants', {
        restaurants: data
      })
    })
  }
}
module.exports = restaurantController
