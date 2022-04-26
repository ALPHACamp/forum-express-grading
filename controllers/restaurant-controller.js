const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const categoryId = Number(req.query.categoryId) || ''

      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          raw: true,
          nest: true,
          limit,
          offset,
          where: {
            ...categoryId ? { categoryId } : {}
          },
          include: [Category]
        }),
        Category.findAll({ raw: true })
      ])

      const favoritedRestaurantsId = req.user?.FavoritedRestaurants.map(fr => fr.id) || []

      const likedRestaurantsId = req.user?.LikedRestaurants.map(lr => lr.id) || []

      const revisedRestaurants = restaurants.rows.map(res => ({
        ...res,
        description: res.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(res.id),
        isLiked: likedRestaurantsId.includes(res.id)
      }))

      return res.render('restaurants', {
        restaurants: revisedRestaurants,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, {
        include: [Category,
          { model: Comment, include: [User] },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
      })
      if (!restaurant) throw new Error('該餐廳不存在！')

      await restaurant.increment('viewCounts')

      const isFavorited = restaurant.FavoritedUsers.some(fu => fu.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(lu => lu.id === req.user.id)

      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLiked
      })
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurantId = req.params.id
      const [restaurant, comment] = await Promise.all([
        Restaurant.findByPk(restaurantId, {
          raw: true,
          nest: true,
          include: [Category]
        }),
        Comment.findAndCountAll({
          where: { restaurantId },
          raw: true,
          nest: true
        })
      ])

      if (!restaurant) throw new Error('該餐廳不存在！')

      res.render('dashboard', { restaurant, comments: comment.count })
    } catch (err) {
      next(err)
    }
  },
  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          limit: 10,
          raw: true,
          nest: true,
          include: [Category],
          order: [['createdAt', 'DESC']]
        }),
        Comment.findAll({
          limit: 10,
          raw: true,
          nest: true,
          include: [Restaurant, User],
          order: [['createdAt', 'DESC']]
        })
      ])

      return res.render('feeds', { restaurants, comments })
    } catch (err) {
      next(err)
    }
  },
  getTopRestaurants: async (req, res, next) => {
    try {
      const LIMIT = 10
      const rawRestaurants = await Restaurant.findAll({
        include: [{ model: User, as: 'FavoritedUsers' }]
      })
      const restaurants = rawRestaurants
        .map(res => ({
          ...res.toJSON(),
          favoritedCount: res.FavoritedUsers.length,
          isFavorited: req.user?.FavoritedRestaurants.some(fr => fr.id === res.id) || []
        }))

      restaurants.sort((a, b) => b.favoritedCount - a.favoritedCount)
      restaurants.splice(LIMIT)

      return res.render('top-restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
