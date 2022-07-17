const { Restaurant, Category, Comment, User, sequelize } = require('../models')
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
        raw: true,
        nest: true,
        limit,
        offset,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        include: [Category]
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const favoriteRestaurantId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoriteRestaurantId.includes(r.id),
          isLiked: likedRestaurantId.includes(r.id)
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
    const id = req.params.id
    return Restaurant.findByPk(id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' }
      ],
      order: [
        [Comment, 'updated_at', 'desc']
      ],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = req.user.LikedRestaurants.some(lr => lr.id === restaurant.id)

        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('comments.id')), 'commentCounts']
        ]
      },
      include: [Category, Comment]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant dosen't exist!")

        res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        limit: 10,
        order: [['created_at', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        raw: true,
        nest: true,
        limit: 10,
        order: [['created_at', 'DESC']],
        include: [User, Restaurant]
      })
    ])
      .then(([restaurants, comments]) => {
        res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    // 以下寫法有使用到SQL原生語法，本地端網頁可正常運作，但測試不通過
    // return Restaurant.findAll({
    //   attributes: {
    //     include: [
    //       [sequelize.literal('(SELECT COUNT(`id`) FROM `Favorites` WHERE `restaurant_id` = `Restaurant`.`id`)'), 'favoritedCount']
    //     ]
    //   },
    //   order: sequelize.literal('`favoritedCount` DESC'),
    //   limit: 10
    // })
    //   .then(restaurants => {
    //     restaurants = restaurants.map(r => ({
    //       ...r.toJSON(),
    //       isFavorited: req.user && req.user.FavoritedRestaurants.some(fr => fr.id === r.id)
    //     }))
    //     res.render('top-restaurants', { restaurants })
    //   })

    return Restaurant.findAll({
      include: [{
        model: User, as: 'FavoritedUsers'
      }]
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r.toJSON(),
          favoritedCount: r.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(fr => fr.id === r.id)
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        return res.render('top-restaurants', { restaurants: data })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
