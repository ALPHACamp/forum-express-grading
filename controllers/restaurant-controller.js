const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => { // 瀏覽所有餐廳頁面:運用展開運算子 ...
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      console.log('data', data)
      return res.render('restaurants', { restaurants: data})
    })
  }
}
module.exports = restaurantController
