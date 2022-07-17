const { Restaurant, Category, User, Comment, Favorite } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: Category,
        limit,
        offset,
        where: { ...(categoryId ? { categoryId } : {}) }
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId =
          req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const LikedRestaurantsId =
          req.user && req.user.LikedRestaurants.map(i => i.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: LikedRestaurantsId.includes(r.id)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(
          f => f.id === req.user.id
        )
        const isLiked = restaurant.LikedUsers.some(i => i.id === req.user.id)
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
  },
  getDashboard: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: Category,
        raw: true,
        nest: true
      }),
      Comment.count({ where: { restaurantId: req.params.id } }),
      Favorite.count({ where: { restaurantId: req.params.id } })
    ])
      .then(([restaurant, comments, favorite]) => {
        res.render('dashboard', { restaurant, comments, favorite })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    Promise.all([
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
        res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: [{ model: User, as: 'FavoritedUsers' }]
      })
      const data = restaurants
        .map(r => ({
          ...r.toJSON(),
          description: r.description.substring(0, 50),
          isFavorited:
            req.user && req.user.FavoritedRestaurants.some(f => f.id === r.id),
          favoritedCount: r.FavoritedUsers.length
        }))
        .sort((a, b) => b.favoritedCount - a.favoritedCount)
        .slice(0, 10)
      return res.render('top-restaurants', { restaurants: data })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
