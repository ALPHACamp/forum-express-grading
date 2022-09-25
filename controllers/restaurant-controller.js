const { Restaurant, Category, Comment, User } = require('../models')

const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(restaurant => restaurant.id)
    const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(restaurant => restaurant.id)
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([Restaurant.findAndCountAll({
      include: Category,
      where: { ...categoryId ? { categoryId } : {} },
      limit,
      offset,
      nest: true,
      raw: true
    }), Category.findAll({ raw: true })])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(restaurant.id),
          isLiked: likedRestaurantsId.includes(restaurant.id)
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
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('view_counts')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(favorite => favorite.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(like => like.id === req.user.id)
        res.render('restaurant', {
          restaurant: restaurant.toJSON(), isFavorited, isLiked
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['created At', 'DESC']],
        include: [Category],
        nest: true,
        raw: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        nest: true,
        raw: true
      })
    ]).then(([restaurants, comments]) => {
      res.render('feeds', {
        restaurants,
        comments
      })
    })
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        const result = restaurants.map(restaurant => ({
          ...restaurant.toJSON(),
          description: restaurant.description.substring(0, 50),
          favoritedCount: restaurant.FavoritedUsers.length,
          isFavorited: req.user.FavoritedRestaurants.some(r => r.id === restaurant.id)
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
        return res.render('top-restaurants', { restaurants: result })
      }).catch(err => next(err))
  }
}

module.exports = restaurantController
