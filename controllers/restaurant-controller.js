const { Restaurant, Category } = require('../models') // 帶入資料庫
const restaurantController = {
  getRestaurants: (req, res) => {
    // 首頁
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
  },
  // 詳情頁
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', {
          restaurant
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
