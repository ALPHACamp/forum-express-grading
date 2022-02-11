const paginatorHelpers = require('../helpers/pagination-helpers')
const authHelpers = require('../helpers/auth-helpers')
const { Restaurant, Category, User, Comment } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    // obtain current category
    const categoryId = Number(req.query.categoryId) || ''
    // define where condition for SQL
    const where = {}
    if (categoryId) where.categoryId = categoryId

    // define paginator setting
    const DEFAULT_LIMIT = 9
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const currentPage = Number(req.query.page) || 1
    const offset = paginatorHelpers.getOffset(DEFAULT_LIMIT, currentPage)

    return Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        where,
        limit,
        offset,
        include: [Category]
      })
    ])
      .then(([categories, restaurants]) => {
        const count = restaurants.count
        const user = authHelpers.getUser(req)
        // obtain a favorite list for each user
        const favoriteList = user && user.FavoritedRestaurants.map(fr => (fr.id))
        // obtain a like list for each user
        const likeList = user && user.LikedRestaurants.map(lr => lr.id)

        restaurants = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          // determine which restaurant is favorited or liked ?
          isFavorited: favoriteList.includes(r.id),
          isLiked: likeList.includes(r.id)
        }))
        return res.render('restaurants', {
          restaurants,
          categories,
          categoryId,
          pagination: paginatorHelpers.getPagination(limit, currentPage, count)
        })
      })
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      nest: true,
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant doesn\'t exist')
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        const userId = authHelpers.getUserId(req)
        // determine whether current restaurant is favorited or liked?
        const isFavorited = restaurant.FavoritedUsers.some(fr => fr.id === userId)
        const isLiked = restaurant.LikedUsers.some(lr => lr.id === userId)
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isLiked,
          isFavorited
        })
      })
      .catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant doesn\'t exist')
        restaurant = restaurant.toJSON()
        res.render('dashboard', { restaurant })
      })
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category,
        limit: 10,
        order: [
          ['createdAt', 'DESC']
        ]
      }),
      Comment.findAll({
        raw: true,
        nest: true,
        limit: 10,
        include: [User, Restaurant],
        order: [
          ['createdAt', 'DESC']
        ]
      })
    ])
      .then(([restaurants, comments]) => {
        return res.render('feeds', { restaurants, comments })
      })
      .catch(error => next(error))
  },
  // Render Top 10 restaurants
  getTopRestaurants: (req, res, next) => {
    const DEFAULT_MAX_TOP_NUMBER = 10

    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurants => {
        const userId = authHelpers.getUserId(req)
        const results = restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(),
            isFavorited: restaurant.FavoritedUsers.some(fu => fu.id === userId),
            favoritedCount: restaurant.FavoritedUsers.length,
            description: restaurant.description.substring(0, 50)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, DEFAULT_MAX_TOP_NUMBER)

        return res.render('top-restaurants', { restaurants: results })
      })
      .catch(error => next(error))
  }
}

exports = module.exports = restaurantController
