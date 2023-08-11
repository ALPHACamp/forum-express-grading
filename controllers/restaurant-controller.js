const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
        where: { // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值
        }
      }),
      Category.findAll({ raw: true, nest: true })
    ])
      .then(([restaurants, categories, categoryId]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data, categories, categoryId })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        const vc = restaurant.viewCounts + 1
        return restaurant.update({ viewCounts: vc })
      })
      .then(() => {
        return Restaurant.findByPk(req.params.id, {
          raw: true,
          nest: true,
          include: [Category]
        })
          .then(restaurant => res.render('restaurant', { restaurant }))
          .catch(err => next(err))
      })
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { // 去資料庫用 id 找一筆資料
      raw: true, // 找到以後整理格式再回傳
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }

}
module.exports = restaurantController
