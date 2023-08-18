const { Restaurant, Category, Comment, User, Favorite } = require('../models')
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
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const LikedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLiked: LikedRestaurantsId.includes(r.id)
        }))
        return res.render('restaurants', { restaurants: data, categories, categoryId, pagination: getPagination(limit, page, restaurants.count) })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    }).then(restaurant => {
      if (!restaurant) throw new Error("Restaurant doesn't exists!")
      return restaurant.increment('viewCounts', { by: 1 })
        .then(() => restaurant.reload())
    }).then(restaurant => {
      const userId = req.user ? req.user.id : null
      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === userId)
      const isLiked = restaurant.LikedUsers.some(l => l.id === userId)
      const newRestaurant = restaurant.toJSON()
      return res.render('restaurant', { restaurant: newRestaurant, isFavorited, isLiked })
    }).catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Promise.all([
      Restaurant.findByPk(id, {
        include: Category,
        nest: true,
        raw: true
      }),
      Comment.findAndCountAll({
        where: { restaurantId: id },
        include: Restaurant
      }),
      Favorite.findAndCountAll({
        where: { restaurantId: id }
      })
    ])
      .then(([restaurant, { count: commentNum }, { count: favoriteNum }]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist")

        restaurant.commentNum = commentNum
        restaurant.favoriteNum = favoriteNum
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
        res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: { model: User, as: 'FavoritedUsers' }
    })
      .then(restaurants => {
        const favoritedRestaurantsId = (req.user && req.user.FavoritedRestaurants.map(fr => fr.id)) || []
        restaurants = restaurants.map(r => ({
          ...r.toJSON(),
          favoritedCount: r.FavoritedUsers.length,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id)
        })).sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
        return res.render('top-restaurants', { restaurants })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
