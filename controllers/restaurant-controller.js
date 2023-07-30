const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const categoryId = Number(req.query.categoryId) || ''

      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const [restaurants, categories] = await Promise.all([
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
        Category.findAll({ raw: true })
      ])
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
      const restaurantData = restaurants.rows.map(restaurant => ({
        ...restaurant,
        description: restaurant.description.substring(0, 50),
        isFavorited: favoritedRestaurantsId.includes(restaurant.id),
        isLiked: likedRestaurantsId.includes(restaurant.id)
      }))

      return res.render('restaurants', {
        restaurants: restaurantData,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurantData.count)
      })
    } catch (error) {
      return next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
      })

      if (!restaurant) throw new Error("Restaurant didn't exist!")

      await restaurant.increment('viewCounts', {
        where: { id: req.params.id },
        by: 1
      })

      const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(l => l.id === req.user.id)

      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLiked
      })
    } catch (error) {
      return next(error)
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id,
        {
          include: Category,
          raw: true,
          nest: true
        })

      if (!restaurant) throw new Error("Restaurant didn't exist!")

      return res.render('dashboard', { restaurant })
    } catch (error) {
      return next(error)
    }
  },

  getFeeds: async (req, res, next) => {
    try {
      const [restaurants, comments] = await Promise.all([
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

      if (!restaurants) throw new Error("Restaurant didn't exist!")

      return res.render('feeds', { restaurants, comments })
    } catch (error) {
      return next(error)
    }
  },

  getTopRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: [
          { model: User, as: 'FavoritedUsers' }]
      })
      if (!restaurants) throw new Error("Restaurant didn't exist!")

      const restaurantsData = await restaurants.map(r => ({
        ...r.toJSON(),
        description: r.description.substring(0, 50),
        favoritedCount: r.FavoritedUsers.length,
        isFavorited: r.FavoritedUsers.some(f => f.id === req.user.id)
      }))
        .sort((a, b) => b.favoritedCount - a.favoritedCount)
        .slice(0, 10)

      return res.render('top-restaurants', { restaurants: restaurantsData })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = restaurantController
