// mvc分流裡的controller

const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 每頁顯示的數量
    // 將categoryId轉成數字或者為空(為全部做準備)
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1 // 頁數預設
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 一頁分幾個預設，req.query還尚未設定。
    const offset = getOffset(limit, page)// 偏移量

    return Promise.all([Restaurant.findAndCountAll({
      include: Category,
      // 當使用者點選的是「全部」這個頁籤時，categoryId 會是空值。設定 where 查詢條件時，撈出全部where: {}
      // categoryId=true=...{categoryId}
      where: { ...categoryId ? { categoryId } : {} },
      limit,
      offset,
      nest: true,
      raw: true
    }), Category.findAll({ raw: true })])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({ ...r, description: r.description.substring(0, 50) }))
        return res.render('restaurants', { restaurants: data, categories, categoryId, pagination: getPagination(limit, page, restaurants.count) })// 回傳給hbs是否需要active
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, { model: Comment, include: User }],
      order: [[Comment, 'createdAt', 'DESC']]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('view_counts')
      })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category, nest: true, raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
// /restaurantController 是一個物件 (object)
// restaurantController 有不同的方法，例如 getRestaurants ，這個方法目前是負責「瀏覽餐廳頁面」，也就是去 render 一個叫做 restaurants 的樣板
