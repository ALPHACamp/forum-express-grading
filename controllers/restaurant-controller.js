const { Restaurant, Category } = require('../models') // 帶入資料庫
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category, // 帶入關聯
      nest: true, // include整理
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r, // 把 r 展開倒入 data 以便做資料修改
        description: r.description.substring(0, 50) // 修改description，擷取 0-50 的文字內容
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  }
}
module.exports = restaurantController
