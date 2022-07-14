const { Sequelize, Restaurant, Category, Comment, User } = require('../models')
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
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ],
      nest: true
    })
      .then(async restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(likedUser => likedUser.id === req.user.id)
        await restaurant.increment('view_counts')
        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        Comment
      ],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
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
        include: [{ model: User, as: 'FavoritedUsers' }],
        // attributes: {
        //   include: [[
        //     Sequelize.fn('COUNT', Sequelize.col('FavoritedUsers.id')),
        //     'favoritedCount'
        //   ]]
        // },
        // group: ['Restaurant.id'],
        // order: [
        //   [Sequelize.literal('favoritedCount'), 'DESC']
        // ],
        nest: true
      })
      .then(restaurants => {
        const LIMIT = 10
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const restaurantsNormalized = restaurants.map(r => {
          const rJSON = r.toJSON()
          const rNormalized = {
            ...rJSON,
            description: rJSON.description.substring(0, 60),
            favoritedCount: rJSON.FavoritedUsers.length,
            isFavorited: favoritedRestaurantsId ? favoritedRestaurantsId.includes(rJSON.id) : false
          }
          return rNormalized
        })
          .sort((pre, next) => (next.favoritedCount - pre.favoritedCount))
          .slice(0, LIMIT)

        res.render('top-restaurants', { restaurants: restaurantsNormalized })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
