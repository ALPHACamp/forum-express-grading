const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const helpers = require('../helpers/auth-helpers')
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
          ...(categoryId ? { categoryId } : {})
        },
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoritedRestaurantsId =
          req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantsId =
          req.user && req.user.LikedRestaurants.map(lr => lr.id)
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
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('查無此餐廳')
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(
          f => f.id === req.user.id
        )
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
    return Restaurant.findByPk(req.params.id, { include: Comment }).then(
      restaurant => {
        restaurant = restaurant.toJSON()
        res.render('dashboard', { restaurant })
      }
    )
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
  // getTopRestaurants: (req, res, next) => {
  //   const userId = helpers.getUser(req).id
  //   return Restaurant.findAll({
  //     attributes: [
  //       'id',
  //       'name',
  //       'description',
  //       'image',
  //       [
  //         Sequelize.literal(
  //           '(select count(*) from Favorites where restaurant_id = Restaurant.id)'
  //         ),
  //         'favoritedCount'
  //       ],
  //       [
  //         Sequelize.literal(
  //           `exists(select 1 from Favorites where user_id = ${userId} and restaurant_id = Restaurant.id)`
  //         ),
  //         'isFavorited'
  //       ]
  //     ],
  //     order: [[Sequelize.col('favoritedCount'), 'DESC']],
  //     limit: 10,
  //     raw: true,
  //     nest: true
  //   })
  //     .then(restaurants => {
  //       console.log('top10資料 ======>', restaurants)
  //       res.render('top-restaurants', { restaurants })
  //     })
  //     .catch(err => next(err))
  // }
  getTopRestaurants: (req, res, next) => {
    const userId = helpers.getUser(req).id
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        restaurants = restaurants
          .map(r => ({
            ...r.toJSON(),
            favoritedCount: r.FavoritedUsers.length,
            isFavorited: r.FavoritedUsers.some(f => f.id === userId)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        res.render('top-restaurants', { restaurants })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
