
const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    // 從網址上拿下來的參數是字串，先轉成 Number 再操作
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    // 因需要撈Restaurant及Category裡的資料，故使用Promise.all
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        // 新增查詢條件
        where: {
          // 檢查 categoryId 是否為空值
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err)) // 補上
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { // Pk 是 primary key 的簡寫，也就是餐廳的 id，去資料庫用 id 找一筆資料
      include: [
        Category,
        { model: Comment, include: User }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        restaurant.increment('viewCount', { by: 1 })
        return restaurant
      })
      .then(restaurant => {
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
