
const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    // Restaurant.findAll 從 Restaurant model 裡取出資料
    return Restaurant.findAll({
      // 運用 include 一併拿出關聯的 Category model
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        // 配合卡片的版型，description用 substring 來處理截為 50 個字
        description: r.description.substring(0, 50)
      }))
      // 把這筆資料傳到restaurants樣板, 以 restaurants 變數來取出餐廳資料
      return res.render('restaurants', {
        restaurants: data
      })
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { // Pk 是 primary key 的簡寫，也就是餐廳的 id，去資料庫用 id 找一筆資料
      raw: true, // 找到以後整理格式再回傳
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
