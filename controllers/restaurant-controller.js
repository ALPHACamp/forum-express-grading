const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { getUser } = require('../helpers/auth-helpers')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 每頁顯示數量
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    // 預留 limit 的 query string, 將來可能會有讓 user 選擇每頁顯示幾筆
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    const user = getUser(req)

    return Promise.all([
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: [Category],
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = user && user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantsId = user && user.LikedRestaurants.map(fr => fr.id)
        const data = restaurants.rows.map(restaurant => (
          {
            ...restaurant,
            description: restaurant.description.substring(0, 50),
            isFavorited: favoritedRestaurantsId.includes(restaurant.id),
            isLiked: likedRestaurantsId.includes(restaurant.id)
          }
        ))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    const user = getUser(req)
    return Restaurant.findByPk(req.params.id, {
      // raw: true, // 為向下傳遞結果並使用 increment 方法，拿掉資料格式整理
      // nest: true,
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")

        return restaurant.increment('viewCounts')
      })
      .then(incrementResult => {
        const isFavorited = incrementResult.FavoritedUsers.some(f => f.id === user.id)
        const isLiked = incrementResult.LikedUsers.some(f => f.id === user.id)
        res.render('restaurant', { restaurant: incrementResult.toJSON(), isFavorited, isLiked })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, Comment]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")

        return res.render('dashboard', { restaurant: restaurant.toJSON() })
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
