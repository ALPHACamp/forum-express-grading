const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const categoryId = req.query.categoryId || ''
      const restaurants = await Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: [Category],
        where: { ...categoryId ? { categoryId } : {} },
        limit,
        offset
      })
      const categories = await Category.findAll({ raw: true })
      const favoritedRestaurantsId = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(fr => fr.id) : []
      const likedRestaurantsId = req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(lr => lr.id) : []
      const data = await restaurants.rows.map(restaurant => ({
        ...restaurant,
        description: restaurant.description.substring(0, 50) + '...',
        isFavorited: favoritedRestaurantsId.includes(restaurant.id),
        isLiked: likedRestaurantsId.includes(restaurant.id)
      }))
      return res.render('restaurants', { restaurants: data, categories, categoryId: categoryId === '' ? '' : Number(categoryId), pagination: getPagination(limit, page, restaurants.count) })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restId = req.params.id
      const restaurant = await Restaurant.findByPk(restId, {
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const isFavorited = restaurant.FavoritedUsers.some(
        favoriteRestaurant => favoriteRestaurant.id === req.user.id
      )
      const isLiked = restaurant.LikedUsers.some(
        likeRestaurant => likeRestaurant.id === req.user.id
      )
      await restaurant.increment('viewCounts')
      return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restId = req.params.id
      const restaurant = await Restaurant.findByPk(restId, { raw: true, nest: true, include: [Category] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('dashboard', { restaurant })
    } catch (error) {
      next(error)
    }
  },
  getFeeds: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        limit: 10,
        include: [Category],
        order: [['createdAt', 'DESC']]
      })

      const comments = await Comment.findAll({
        raw: true,
        nest: true,
        limit: 10,
        include: [User, Restaurant],
        order: [['createdAt', 'DESC']]
      })

      return res.render('feeds', { restaurants, comments })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
