const { Restaurant, Category, Comment, User } = require('../models/')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    const DEFAULT_LIMIT = 9
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
      Category.findAll({
        raw: true
      })
    ])
      .then(([restaurants, categories]) => {
        const FavoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const LikedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
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
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' }, // 找到所有Favorited這間餐廳的User
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 比對FavoritedUsers陣列中有沒有登入者的id並回傳布林值
        const isFavorited = restaurant.FavoritedUsers.some(fu => fu.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(lu => lu.id === req.user.id)
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
        return restaurant.increment('view_counts')
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: Category
      }),
      Comment.findAndCountAll({
        raw: true,
        nest: true,
        where: { restaurantId: req.params.id }
      })
    ])
      .then(([restaurant, comment]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant, comment })
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
  }
}
module.exports = restaurantController
