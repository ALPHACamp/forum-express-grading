const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res) => {
    try {
      const DEFAULT_LIMIT = 9
      const categoryId = Number(req.query.categoryId) || ''
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)
      const restaurants = await Restaurant.findAndCountAll({ include: Category, nest: true, raw: true, where: { ...categoryId ? { categoryId } : {} }, limit, offset })
      const categories = await Category.findAll({ raw: true })
      const FavoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const LikedRestaurantsId = req.user && req.user.LikedRestaurants.map(fr => fr.id)
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        isFavorited: FavoritedRestaurantsId.includes(r.id),
        isLiked: LikedRestaurantsId.includes(r.id)
      }))
      res.render('restaurants', { restaurants: data, categories, categoryId, pagination: getPagination(limit, page, restaurants.count) })
    } catch (err) {
      console.log(err)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category, { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      const isFavorited = await restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = await restaurant.LikedUsers.some(f => f.id === req.user.id)
      await restaurant.increment('view_counts')
      res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
    } catch (err) {
      next(err)
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category, Comment], nest: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 5,
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
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({ include: [{ model: User, as: 'FavoritedUsers' }] })
      .then(restaurants => {
        restaurants = restaurants.map(restaurant => ({
          ...restaurant.toJSON(),
          description: restaurant.description.substring(0, 50),
          favoritedCount: restaurant.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(f => f.id === restaurant.id)
        })).sort((a, b) => b.favoritedCount - a.favoritedCount)
        res.render('top-restaurants', { restaurants })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
