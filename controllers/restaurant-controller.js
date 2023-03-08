const assert = require('assert')
const { Restaurant, Category, Comment, User, Favorite } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const sequelize = require('sequelize')
<<<<<<< HEAD
const helpers = require('../helpers/auth-helpers')
=======
>>>>>>> 2f164760f3f766797d3ce2e0e351dca9e2445109

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
        const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
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
      ],
      // 依照時間調整留言順序
      order: [
        [Comment, 'updatedAt', 'DESC']
      ]
    })
      .then(restaurant => {
        assert(restaurant, "Restaurant didn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const restaurantId = req.params.id
    return Promise.all([
      Restaurant.findByPk(restaurantId, {
        include: Category,
        raw: true,
        nest: true
      }),
      Comment.count({
        where: {
          ...restaurantId ? { restaurantId } : {}
        }
      })
    ])
      .then(([restaurant, totalComments]) => {
        res.render('dashboard', { restaurant, totalComments })
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
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        const result = restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(),
            favoritedCount: restaurant.FavoritedUsers.length,
            isFavorited: req.user && req.user.FavoritedRestaurants.some(fr => fr.id === restaurant.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        res.render('top-restaurants', { restaurants: result })
      })
      .catch(err => next(err))
  }
  // getTopRestaurants: (req, res, next) => {
  //   const reqUser = helpers.getUser(req)
  //   return Promise.all([
  //     Restaurant.findAll({
  //       attributes: {
  //         include: [
  //           [
  //             sequelize.literal(`(
  //               SELECT COUNT(*)
  //               FROM Favorites
  //               WHERE Favorites.restaurant_id = Restaurant.id
  //               )`),
  //             'favoritedCount'
  //           ]
  //         ]
  //       },
  //       order: [
  //         [sequelize.literal('favoritedCount'), 'DESC']
  //       ],
  //       limit: 10,
  //       raw: true,
  //       nest: true
  //     }),
  //     Favorite.findAll({
  //       where: {
  //         userId: reqUser.id
  //       },
  //       raw: true,
  //       nest: true
  //     })
  //   ])
  //     .then(([restaurants, favorite]) => {
  //       const favoriteId = favorite.map(f => f.restaurantId)
  //       const data = restaurants.map(r => ({
  //         ...r,
  //         isFavorited: favoriteId.includes(r.id)
  //       }))
  //       return res.render('top-restaurants', { restaurants: data })
  //     })
  // }
}
module.exports = restaurantController
