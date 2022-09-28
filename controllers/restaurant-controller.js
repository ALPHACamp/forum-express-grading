
const { Restaurant, Category, Comment, User } = require('../models')
const { getOffSet, getOpagination } = require('../helpers/pagination-helper')
const { getUser } = require('../helpers/auth-helpers')
const assert = require('assert')
const restaurantController = {

  getRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffSet(page, limit)
    try {
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          raw: true,
          nest: true,
          limit: limit,
          offset: offset,
          include: [Category],
          where: { ...categoryId ? { categoryId } : {} }
        }),
        Category.findAll({ raw: true })
      ])
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(rest => rest.id)
      const LikeRestaurantsId = req.user && req.user.LikeRestaurants.map(rest => rest.id)
      const data = restaurants.rows.map(r => {
        return {
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId.includes(r.id),
          isLike: LikeRestaurantsId.includes(r.id)
        }
      })

      return res.render('restaurants',
        {
          restaurants: data,
          categories,
          categoryId,
          pagination: getOpagination(page, limit, restaurants.count)

        })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, {
        nest: true,
        include: [Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikeUsers' }],
        order: [[Comment, 'createdAt', 'DESC']]

      })
      assert(restaurant, '找不到指定餐廳')
      await restaurant.increment('viewCounts')// 計算瀏覽次數
      const favoritedUserId = restaurant.FavoritedUsers.map(user => user.id)
      const LikeUserId = restaurant.LikeUsers.map(user => user.id)
      const isLike = LikeUserId.includes(getUser(req).id)
      const isFavorited = favoritedUserId.includes(getUser(req).id)
      res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLike })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, { nest: true, raw: true, include: Category })
      const comment = await Comment.findAndCountAll({ where: { restaurantId: id } })
      res.render('dashboard', { restaurant, commentAmount: comment.count })
    } catch (error) {

    }
  },
  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          raw: true,
          limit: 10,
          nest: true,
          order: [['createdAt', 'DESC']],
          include: Category
        }),
        Comment.findAll({
          raw: true,
          limit: 10,
          nest: true,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant]
        })
      ])
      res.render('feeds', { restaurants, comments })
    } catch (error) {
      next(error)
    }
  },
  getTopRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 10
    try {
      let restaurants = await Restaurant.findAll({
        include: { model: User, as: 'FavoritedUsers' }
      })
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.toJSON(),
        favoritedCount: restaurant.FavoritedUsers.length,
        isFavorited: req.user && req.user.FavoritedRestaurants.some(f => f.id === restaurant.id)
      })).sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, DEFAULT_LIMIT)
      res.render('top-restaurant', { restaurants })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restaurantController
