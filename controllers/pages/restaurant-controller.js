const { Restaurant, Category, Comment, User } = require('../../models')
const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
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
