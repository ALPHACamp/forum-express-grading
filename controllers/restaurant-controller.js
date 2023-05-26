const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const page = Number(req.query.page) || 1
    const offset = getOffset(limit, page)
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
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
        // 把passport反序列化的最愛跟喜歡餐廳清單跟要顯示的餐廳清單對照，若清單內有就給true
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(item => {
          item.description = item.description.substring(0, 50)
          item.isFavorited = favoritedRestaurantsId.includes(item.id)
          item.isLiked = likedRestaurantsId.includes(item.id)
          return item
        })
        const pagination = getPagination(limit, page, restaurants.count)
        res.render('restaurants', { restaurants: data, categories, categoryId, pagination })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurants didn't exist!")
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
        return Promise.all([
          restaurant.increment('viewCounts', { by: 1 }),
          res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
        ])
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        Comment
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurants didn't exist!")
        restaurant = restaurant.toJSON()
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [
          ['createdAt', 'DESC']
        ],
        include: [Category],
        nest: true,
        raw: true
      }),
      Comment.findAll({
        limit: 10,
        order: [
          ['createdAt', 'DESC']
        ],
        include: [Restaurant, User],
        nest: true,
        raw: true
      })
    ])
      .then(([restaurants, comments]) => {
        res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
