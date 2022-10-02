const {
  Restaurant,
  Category,
  Comment,
  User,
  Favorite
} = require('../models')
const {
  getOffset,
  getPagination
} = require('../helpers/pagination-helper')
const restController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([Restaurant.findAndCountAll({
      include: Category,
      where: {
        ...categoryId
          ? {
              categoryId
            }
          : {}
      },
      limit,
      offset,
      nest: true,
      raw: true
    }), Category.findAll({
      raw: true
    })])
      .then(([restaurants, categories]) => {
        const FavoritedRestaurantsId = req.user?.FavoritedRestaurants.map(fr => fr.id)
        const LikedRestaurantsId = req.user?.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: FavoritedRestaurantsId.includes(r.id),
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
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, {
        model: Comment,
        include: User
      }, {
        model: User,
        as: 'FavoritedUsers'
      }, {
        model: User,
        as: 'LikedUsers'
      }]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts', {
          by: 1
        })
      })
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
    return Restaurant.findByPk(req.params.id, {
      include: [Category, {
        model: Comment,
        include: User
      }],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([Restaurant.findAll({
      include: Category,
      limit: 5,
      order: [
        ['createdAt', 'DESC']
      ],
      raw: true,
      nest: true
    }), Comment.findAll({
      include: [Restaurant, User],
      limit: 5,
      order: [
        ['createdAt', 'DESC']
      ],
      raw: true,
      nest: true
    })])
      .then(([restaurants, comments]) => {
        res.render('feeds', {
          restaurants,
          comments
        })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({ include: [{ model: User, through: Favorite, as: 'FavoritedUsers' }] })
      .then(restaurants => {
        const TopRestaurants = restaurants.map(r => ({
          ...r.toJSON(),
          favoritedCount: r.FavoritedUsers.length,
          isFavorited: req.user?.FavoritedRestaurants.some(f => f.id === r.id)
        })).sort((a, b) => b.favoritedCount - a.favoritedCount).filter((_, index) => index < 10)
        res.render('Top 10 人氣餐廳', { restaurants: TopRestaurants })
      })
  }
}
module.exports = restController
