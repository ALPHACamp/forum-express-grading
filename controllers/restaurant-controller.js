const { Restaurant, Category } = require('../models')
const restaurantController = {
  // getRestaurants => 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category, // 分類資料
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50) // 截取50字串
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  }
}
module.exports = restaurantController
