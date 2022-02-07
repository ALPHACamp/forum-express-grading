const { User, Restaurant, Category, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = req.query.page === '0' ? 0 : Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    return Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findAndCountAll({
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset: getOffset(limit, page),
        raw: true,
        nest: true,
        include: Category
      })
    ])
      .then(([categories, restaurants]) => {
        const pagination = getPagination(limit, page, restaurants.count)
        const FavoritedRestaurantsId = req.user.FavoritedRestaurants.map(fr => fr.id)
        const LikedRestaurantsId = req.user.LikedRestaurants.map(lr => lr.id)
        if (!pagination.pages.includes(page)) throw new Error("Page didn't exist!")
        restaurants = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: req.user && FavoritedRestaurantsId.includes(r.id),
          isLiked: req.user && LikedRestaurantsId.includes(r.id)
        }))
        return res.render('restaurants', {
          categories,
          restaurants,
          categoryId,
          pagination
        })
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
      .then(([restaurants, comments]) => res.render('feeds', { restaurants, comments }))
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant
      .findByPk(req.params.id, {
        nest: true,
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
      })
      .then(restaurant => restaurant.increment('viewCounts'))
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant
      .findByPk(req.params.id, {
        nest: true,
        include: [Category, Comment]
      })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
