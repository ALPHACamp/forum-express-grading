const { Restaurant, Category, Comment, User } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')

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
        // console.log(req.user)
        const favoritedRestaurantId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantId.includes(r.id),
          isLiked: likedRestaurantId.includes(r.id)
        }))

        return res.render('restaurants', {
          restaurants: data, categories, categoryId, pagination: getPagination(limit, page, restaurants.count)
        })
      }).catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(f => f.id === req.user.id)
        res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: [Category, Comment] })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        const restJSON = restaurant.toJSON()
        // restJSON.commentCounts = restJSON.Comments.length
        res.render('dashboard', { restaurant: restJSON })
      }).catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC'], ['id', 'ASC']],
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
    ]).then(([restaurants, comments]) => {
      res.render('feeds', { restaurants, comments })
    }).catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      limit: 10,
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        restaurants = restaurants.map(rest => ({
          ...rest.toJSON(),
          favoritedCount: rest.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(fu => fu.id === rest.id)
        }))
        restaurants = restaurants.sort((a, b) => b.favoritedCount - a.favoritedCount)
        res.render('top-restaurants', { restaurants })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
