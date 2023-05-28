const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantColler = {
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
      Category.findAll({ raw: true }) // 為了render category-Nav
    ])
      .then(([restaurants, categories]) => {
        const favoratedRestaurantsId = req.user.FavoritedRestaurants.map(fr => fr.id)
        const likedRestaurantsId = req.user.LikedRestaurants.map(lr => lr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoratedRestaurantsId.includes(r.id), // 這樣data裡面就有isFavorated這個boolean值
          isLiked: likedRestaurantsId.includes(r.id)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.counts)
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        { model: Category, required: true },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        {
          model: Comment,
          include: [
            { model: User, required: true }
          ],
          order: [['created_at', 'DESC']],
          required: false,
          separate: true
        }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('沒這間')
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)
        restaurant.increment('viewCounts')
        res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      }),
      Comment.findAndCountAll({
        where: { restaurantId: req.params.id }
      })
    ])
      .then(([restaurant, comments]) => {
        if (!restaurant) throw new Error('沒這間')
        return res.render('dashboard', { restaurant, comments })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']], // DESC ASC
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
      include: [{ model: User, as: 'FavoritedUsers' }],
      // raw: true,
      // nest: true, 格式會不樣. FavoritedUsers 這個會是 { } 而不是 [ ]
      limit: 10
    })
      .then(restaurants => {
        restaurants = restaurants.map(r => ({
          ...r.toJSON(),
          favoritedCount: r.FavoritedUsers.length,
          isFavorited: req.user.FavoritedRestaurants.some(f => f.id === r.id)
          // description: r.description.substring(0, 40)
        }))
        restaurants.sort((a, b) => b.favoritedCount - a.favoritedCount)
        res.render('top-restaurants', { restaurants })
      })
  }
}

module.exports = restaurantColler
