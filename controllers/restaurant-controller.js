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
    } catch (err) {
      next(err)
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
        ],
        nest: true
      })
      if (!restaurant) { throw new Error("Restaurant didn't exist!") }
      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(f => f.id === req.user.id)
      // If success messages, don't increse the view count(Only when like/unlike, favorite/unfavorite will flash success message)
      if (!res.locals.success_messages.length) { await restaurant.increment('viewCounts') }
      return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      })
      if (!restaurant) { throw new Error("Restaurant didn't exist!") }
      return res.render('dashboard', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
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
      res.render('feeds', {
        restaurants,
        comments
      })
    } catch (err) {
      next(err)
    }
  },
  getTopRestaurants: async (req, res, next) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        restaurants = restaurants.map(rest => ({
          ...rest.toJSON(),
          favoritedCount: rest.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(fu => fu.id === rest.id)
        }))
        restaurants = restaurants.sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
        res.render('top-restaurants', { restaurants })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
