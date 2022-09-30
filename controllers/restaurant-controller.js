const { Category, Comment, Favorite, Restaurant, User } = require('../models')
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
        const favoriteRestaurantsId = req.user && req.user.FavoriteRestaurants.map(fr => fr.id)
        const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorite: favoriteRestaurantsId.includes(r.id),
          isLiked: likedRestaurantsId.includes(r.id)
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
  getRestaurant: async (req, res, next) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoriteUsers' },
        { model: User, as: 'LikedUsers' }],
      nest: true
    })
    if (!restaurant) throw new Error("Restaurant didn't exist!")
    const isFavorite = restaurant.FavoriteUsers.some(f => f.id === req.user.id)
    const isLiked = restaurant.LikedUsers.some(liked => liked.id === req.user.id)
    await restaurant.increment('viewCounts', { by: 1 })
    res.render('restaurant', {
      restaurant: restaurant.toJSON(),
      isFavorite,
      isLiked
    })
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
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
        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant
      .findAll({
        include: [{ model: User, as: 'FavoriteUsers' }]
      })
      .then(topRestaurants => {
        const restaurants = topRestaurants.map(r => ({
          ...r.toJSON(),
          favoriteCount: r.FavoriteUsers.length,
          isFavorite: req.user && req.user.FavoriteRestaurants.some(fr => fr.id === r.id)
        }))
          .sort((a, b) => b.favoriteCount - a.favoriteCount)
          .slice(0, 10)
        res.render('top-restaurants', { restaurants })
      })
      .catch(e => next(e))
  }
}
module.exports = restaurantController
