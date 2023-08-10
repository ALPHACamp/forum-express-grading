const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r,
          // 當 key 重複時，後面出現的會取代前面的
          description: r.description.substring(0, 50) // description 擷取前 50 個字元
        }))

        return res.render('restaurants', { restaurants: data })
      })
  }
}

module.exports = restaurantController
