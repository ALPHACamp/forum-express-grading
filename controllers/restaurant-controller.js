const { Category, Restaurant, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const categoryId = Number(req.query.categoryId) || ''
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: {
          ...(categoryId ? { categoryId } : {}) // 檢查 categoryId 是否為空值
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
        // map後的()是IIFE嗎？
        // const data = restaurants.rows.map(r => ({
        // ...r,
        // description: r.description.substring(0, 50),
        // isFavorite: req.user && req.user.FavoritedRestaurants.map(fr => fr.id).includes(r.id)
        // &&(logical operator) if the left hand side is true, then evaluates as the right hand side
        const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id)
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
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(restaurant => {
        // restaurant.FavoritedUsers中如果有登入的user.id則return true
        const isFavorited = restaurant.FavoritedUsers.some(
          f => f.id === req.user.id
        )
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited
        })
        restaurant.increment('viewCounts')
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Promise.all([
      Restaurant.findByPk(id, { include: Category, raw: true, nest: true }),
      Comment.findAndCountAll({ where: { restaurantId: 153 } })
    ])
      .then(([restaurant, commentCounts]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', {
          restaurant,
          commentCounts: commentCounts.count
        })
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
        res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
