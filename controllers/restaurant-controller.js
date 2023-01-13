// 前台restaurant專用的controller
const { Restaurant, Category, Comment, User } = require('../models')
// 引用helper
const { getOffset, getPagination } = require('../helpers/page-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    // 有點分類、未分類 or 一進首頁 or 點全部
    const categoryId = (req.query.categoryId === undefined || req.query.categoryId === '') ? '' : Number(req.query.categoryId)
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Promise.all([
      Restaurant.findAndCountAll({
        // 期望：where { categoryId } or { categoryId: null } or {}
        where: {
          ...(categoryId) ? { categoryId } : (typeof categoryId === 'number') ? { categoryId: null } : {} // 檢查 categoryId 存在與否回傳{ categoryId } or {}，最後再展開
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
        const FavoritedRestaurantsId = req.user.FavoritedRestaurants.map(item => item.id)
        const LikedRestaurantsId = req.user.LikedRestaurants.map(item => item.id)
        // 縮減字數到50 --方法1：substring --方法2（用Bootstrap text-truncate class）
        const data = restaurants.rows.map(item => ({
          ...item, // 展開運算子：把 r 的 key-value pair 展開，直接放進來
          description: item.description.substring(0, 50), // 只有description的部份會被新的（r.description.subs...）覆蓋
          isFavorited: FavoritedRestaurantsId.includes(item.id), // 回傳true or false
          isLiked: LikedRestaurantsId.includes(item.id) // 回傳true or false
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
  getRestaurantDetail: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('This restaurant is not existed!')
        return restaurant.increment('view_counts', { by: 1 })
      })
      .then(restaurant => {
        // 使用 some：迭代過程中找到一個符合條件的項目後，就會立刻回傳 true
        const isFavorited = restaurant.FavoritedUsers.some(item => item.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(item => item.id === req.user.id)
        res.render('restaurant-detail', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Promise.all([
      Restaurant.findByPk(id, {
        nest: true,
        raw: true,
        include: [Category, Comment]
      }),
      Comment.findAndCountAll({
        where: { restaurantId: id },
        raw: true
      })
    ])
      .then(([restaurant, comments]) => {
        if (!restaurant) throw new Error('This restaurant is not existed!')
        res.render('dashboard', { restaurant, commentCounts: comments.count })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    const categoryId = (req.query.categoryId === undefined || req.query.categoryId === '') ? '' : Number(req.query.categoryId)
    const order = [['createdAt', 'DESC']]
    const limit = 10
    return Promise.all([
      Restaurant.findAll({
        where: {
          ...(categoryId) ? { categoryId } : (typeof categoryId === 'number') ? { categoryId: null } : {} // 檢查 categoryId 存在與否回傳{ categoryId } or {}，最後再展開
        },
        order,
        limit,
        raw: true,
        nest: true,
        include: [Category]
      }),
      Comment.findAll({
        order,
        limit,
        raw: true,
        nest: true,
        include: [
          {
            model: Restaurant,
            where: { ...(categoryId) ? { categoryId } : (typeof categoryId === 'number') ? { categoryId: null } : {} }
          },
          User
        ]
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, comments, categories]) => {
        const restData = restaurants.map(el => (
          (el.description.length >= 20) ? { ...el, description: el.description.substring(0, 20) + '...' } : { ...el }
        ))
        const comData = comments.map(el => (
          (el.text.length >= 20) ? { ...el, text: el.text.substring(0, 20) + '...' } : { ...el }
        ))
        res.render('feeds', {
          restaurants: restData,
          comments: comData,
          categoryId,
          categories
        })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: { model: User, as: 'FavoritedUsers' }
    })
      .then(restaurants => {
        const data = restaurants
          .map(item => ({
            ...item.toJSON(),
            description: (item.description.length > 40) ? item.description.substring(0, 40) + '...' : item.description,
            favoritedCount: item.FavoritedUsers.length,
            isFavorited: req.user && item.FavoritedUsers.some(user => user.id === req.user.id) // req.user 有可能是空的
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .splice(0, 10)
        res.render('top-restaurants', { restaurants: data })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
