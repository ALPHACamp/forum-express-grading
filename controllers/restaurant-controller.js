const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper') // 引入分頁helper

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || '' // 自前端取得?後的id

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    // 修改以下
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: { ...categoryId ? { categoryId } : {} }, // 檢查 categoryId 是否為空值
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id) 
        const data = restaurants.rows.map(r => ({ // rows=findAndCountAll會產生的陣列，另外會產生count的整數
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id) // req.user && req.user.FavoritedRestaurants取出使用者的收藏清單，再以mapmap 成 id 清單用 Array 的 includes 方法進行比對，最後會回傳布林值。
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
    return Restaurant.findByPk(req.params.id, {
      include: [Category, { model: Comment, include: User }, { model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('viewCounts', { by: 1 })
        return restaurant
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)

        res.render('restaurant', { restaurant: restaurant.toJSON(),isFavorited })
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
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }, // 補逗點，新增以下
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController // 匯出
