const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    // Pagination
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Promise.all([
      Restaurant.findAndCountAll({
        where: {
          // 展開運算子的優先值比較低，會先處理後面判斷再來展開
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset,
        raw: true,
        nest: true,
        include: Category
      }),
      Category.findAll({
        raw: true
      })
    ])
      .then(([restaurants, categories]) => {
        // 優化，避免於迭代器中重複執行
        const favoriteRestaurantsId = req.user.FavoriteRestaurants.map(fr => fr.id)
        const likedRestaurantsId = req.user.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          // 確認是否有user，將餐廳新增isFavorite，並篩選是否有被加入 Favorite，把不能掌控的變數來源做檢查，降低風險。
          isFavorite: req.user && favoriteRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoriteUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        console.log(restaurant)
        // .some() 執行到 true 就會停止
        const isFavorite = restaurant.FavoriteUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
        // const favoriteRestaurantsId = req.user.FavoriteRestaurants.map(fr => fr.id)
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          // isFavorite: favoriteRestaurantsId.includes(restaurant.id)
          isFavorite,
          isLiked
        })
      })
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('dashboard', { restaurant: restaurant.toJSON() })
        // 每一次 request 增加瀏覽次數
        restaurant.increment('viewCounts', { by: 1 })
      })
      .catch(err => next(err))
  },
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
        res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
