const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const page = Number(req.query.page) || 1
      const offset = getOffset(limit, page)
      const categoryId = Number(req.query.categoryId) || ''
      const [restaurants, categories] = await Promise.all([
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
        Category.findAll({
          raw: true
        })
      ])
      const FavoritedRestaurantsId = req.user ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
      const LikedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
      const data = restaurants.rows.map(rest => ({
        ...rest,
        description: rest.description.substring(0, 50),
        isFavorited: FavoritedRestaurantsId.includes(rest.id),
        isLiked: LikedRestaurantsId.includes(rest.id)
      }))
      res.render('restaurants', {
        restaurants: data,
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
      const restaurant = await Restaurant.findByPk(req.params.id, {
        nest: true,
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ],
        order: [[Comment, 'createdAt', 'DESC']]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const isFavorited = restaurant.FavoritedUsers.some(fu => fu.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(lu => lu.id === req.user.id)
      res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
      await restaurant.increment('viewCounts')
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          raw: true,
          limit: 10,
          order: [
            ['createdAt', 'DESC']
          ]
        }),
        Comment.findAll({
          raw: true,
          limit: 10,
          order: [
            ['createdAt', 'DESC']
          ]
        })
      ])
      res.render('feeds', { restaurants, comments })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
