const { Restaurant, Category } = require('../models')

const restaurantColler = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        const data = restaurant.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
          // 意思是 找出來的restaurant裡面有什麼 data就有什麼, 而且description是處理過的
        }))
        return res.render('restaurants', { restaurants: data })
      })
  }
}

module.exports = restaurantColler
