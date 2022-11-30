const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category, // 關聯資料
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', { restaurants: data })
    })
  }
}

module.exports = restaurantController
