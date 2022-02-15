const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    try {
      const restaurants = await Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset
      })
      const categories = await Category.findAll({ raw: true })
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
      const data = restaurants.rows.map(r => {
        const description = r.description === '' ? '　' : r.description.substring(0, 50)
        return {
          ...r,
          description,
          // 比對與目前餐廳 id 是否相同
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
        }
      })
      res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
      await restaurant.increment('viewCounts')
      res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: Category
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant })
    } catch (error) {
      next(error)
    }
  },
  getFeeds: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true,
        include: [Category]
      })
      const comments = await Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true,
        include: [User, Restaurant]
      })
      const data = restaurants.map(item => ({
        ...item,
        description: item.description.substring(0, 50)
      }))
      res.render('feeds', { restaurants: data, comments })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
