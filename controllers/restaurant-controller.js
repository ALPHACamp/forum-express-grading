const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const helper = require('../helpers/auth-helpers')

const restaurantController = {
  // getRestaurants => 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    const categoryId = Number(req.query.categoryId) || ''
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          // 新增查詢條件 categoryId 是否為空值
          ...(categoryId ? { categoryId } : {})
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ]).then(([restaurants, categories]) => {
      // 簡化 isFavorited
      const favoritedRestaurantsId =
        req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      // likedRestaurantsId
      const likedRestaurantsId =
        req.user && req.user.LikedRestaurants.map(lr => lr.id)

      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        // 取出使用者的收藏清單，然後 map 成 id 清單
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
        // 從 categoryId 取 Category name
        Category,
        // 從 restaurant 找 Comment model 再找 comment 的 user
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' } // restaurant.LikedUsers[]
      ]
    })
      .then(restaurant => {
        // console.log(restaurant.Comments[0].dataValues)
        const isFavorited = restaurant.FavoritedUsers.some(
          f => f.id === req.user.id
        )
        const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('viewCounts', { by: 1 })
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  // dashboard
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category],
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
        order: [['createdAt', 'DESC']], // 降序
        include: [Category], // 引入的 Model
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
  // top-restaurants
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      // 收藏數
      include: [Category, { model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        restaurants = restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(), // 整理格式
            favoritedCount: restaurant.FavoritedUsers.length,
            isFavorited: restaurant.FavoritedUsers.some(
              f => f.id === helper.getUser(req).id
            )
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        res.render('top-restaurants', { restaurants })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
