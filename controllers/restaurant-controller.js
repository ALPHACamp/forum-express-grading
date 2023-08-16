const { Restaurant, Category, Comment, User } = require('../models') // 引入資料庫
const { getOffset, getPagination } = require('../helpers/pagination-helper') // 引入 pagination-helper

const restaurantController = {
  getRestaurants: (req, res, next) => {
    // for pagination
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    const categoryId = Number(req.query.categoryId) || ''
    // const where = {}
    // if (categoryId) where.CategoryId = categoryId
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...categoryId ? { CategoryId: categoryId } : {}
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ]).then(([restaurants, categories]) => {
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(fr => fr.id)
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(r.id),
        isLiked: likedRestaurantsId.includes(r.id)
      }))
      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(f => f.id === req.user.id)
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('viewCounts', { by: 1 })
        res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
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
        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    // 撈出所有 Restaurant 與 followers 資料
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        const result = restaurants
          // 整理 restaurants 資料，把每個 restaurant 項目都拿出來處理一次，並把新陣列儲存在 restaurants 裡
          .map(restaurant => ({
            ...restaurant.toJSON(),
            description: restaurant.description.substring(0, 75),
            favoritedCount: restaurant.FavoritedUsers.length,
            isFavorited: req.user && req.user.FavoritedRestaurants.some(f => f.id === restaurant.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        res.render('top-restaurants', { restaurants: result })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
