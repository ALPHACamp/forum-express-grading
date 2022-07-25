const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    const DEFAULT_LIMIT = 9

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    Promise.all([Restaurant.findAndCountAll({
      include: Category,
      where: {
        ...categoryId ? { categoryId } : {}
      },
      limit,
      offset,
      nest: true,
      raw: true
    }),
    Category.findAll({ raw: true })]).then(([restaurants, categories]) => {
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const LikeRestaurantId = req.user && req.user.LikeRestaurants.map(like => like.id)
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(r.id),
        isLike: LikeRestaurantId.includes(r.id)
      }))
      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    }).catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {

      include: [Category, {
        model: Comment,
        include: User
      },
      { model: User, as: 'FavoritedUsers' },
      { model: User, as: 'LikeUsers' }],
      order: [[{ model: Comment }, 'updatedAt', 'DESC']]

    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLike = restaurant.LikeUsers.some(l => l.id === req.user.id)
        return restaurant.increment(
          'viewCounts', { by: 1 }
        ).then(restaurant => {
          res.render('restaurant', {
            restaurant: restaurant.toJSON(),
            isFavorited,
            isLike
          })
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, { model: Comment }]
    }).then(restaurant => {
      res.render('dashboard', {
        restaurant: restaurant.toJSON()
      })
    }).catch(err => next(err))
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
    const categoryId = Number(req.query.categoryId) || ''
    Restaurant.findAndCountAll({
      include: Category,
      where: {
        ...categoryId ? { categoryId } : {}
      }
    }).then(restaurants => {
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(r.id)
      })).slice(0, 10)
      return res.render('top-restaurants', { restaurants: data })
    })
  }
}
module.exports = restaurantController
