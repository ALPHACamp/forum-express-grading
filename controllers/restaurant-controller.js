// - 處理屬於前台restaurant路由的相關請求
const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: async (req, res) => {
    const restaurants = await Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
    // - 對原有description進行字數刪減
    const data = restaurants.map(r => ({
      ...r,
      description: r.description.substring(0, 50)
    }))
    return res.render('restaurants', { restaurants: data })
  }
}

module.exports = restaurantController
