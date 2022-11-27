const { Restaurant, Category } = require('../models')
const restaurantController = {

  // 顯示每間餐廳的統計數據
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant
        })
      })
      .catch(err => next(err))
  },

  // 顯示首頁index page
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || '' // 從網址上拿下來的參數
    return Promise.all([
      Restaurant.findAll({
        include: Category,
        where: { // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        },
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId
        })
      })
      .catch(err => next(err))
  },

  // 顯示每間餐廳的細節頁面
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
      nest: true
      // raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('viewCounts')
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  }

}
module.exports = restaurantController
