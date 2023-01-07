// 前台restaurant專用的controller
const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    // 有點分類 or 全部
    const categoryId = Number(req.query.categoryId) || '' // 也可以寫成 = +req.query.categoryId || ''
    return Promise.all([
      Restaurant.findAll({
        // 期望：where { categoryId } or {}
        where: {
          ...(categoryId ? { categoryId } : {}) // 檢查 categoryId 存在與否回傳{ categoryId } or {}，最後再展開
        },
        raw: true,
        nest: true,
        include: [Category]
      }),
      Category.findAll({
        raw: true
      })])
      .then(([restaurants, categories]) => {
        // 縮減字數到50 --方法1
        // const data = restaurants.map(r => ({
        //   ...r, // 展開運算子：把 r 的 key-value pair 展開，直接放進來
        //   description: r.description.substring(0, 50) // 只有description的部份會被新的（r.description.subs...）覆蓋
        // }))
        // res.render('restaurants', { restaurants: data })
        // 縮減字數到50 --方法2（用Bootstrap text-truncate class）
        res.render('restaurants', { restaurants, categories, categoryId })
      })
      .catch(err => next(err))
  },
  getRestaurantDetail: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('This restaurant is not existed!')
        return restaurant.increment('view_counts', { by: 1 })
      })
      .then(restaurant => res.render('restaurant-detail', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      raw: true,
      nest: true,
      includ: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('This restaurant is not existed!')
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
