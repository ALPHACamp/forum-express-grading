const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    const FIRST_RENDER_PAGE = 1
    const DEFAULT_LIMIT = 9

    try {
      const page = Number(req.query.page) || FIRST_RENDER_PAGE
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const categoryId = Number(req.query.categoryId) || ''
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          include: [Category],
          where: {
            ...categoryId ? { categoryId } : {}
          },
          limit,
          offset,
          nest: true,
          raw: true
        }),
        Category.findAll({ raw: true })
      ])
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)

      const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(fr => fr.id)

      const data = restaurants.rows.map(r => ({
        ...r,
        description: r.description.substring(0, 50), // show only first 50 characters
        isFavorited: favoritedRestaurantsId.includes(r.id), // if (r.id in favoritedRestaurantsId) => true
        isLiked: likedRestaurantsId.includes(r.id) // if (r.id in likedRestaurantsId) => true
      }))
      return res.render('restaurants', { // go to restaurants.hbs
        restaurants: data,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.rest_id,
        {
          include: [
            Category,
            { model: Comment, include: [User] },
            { model: User, as: 'FavoritedUsers' },
            { model: User, as: 'LikedUsers' }
          ],
          nest: true
        }
      )
      if (!restaurant) throw new Error("Restaurant didn't exist!") // didnot find a restaurant

      const comments = await Comment.findAll(
        {
          include: [User],
          where: { restaurantId: restaurant.id },
          order: [
            ['createdAt', 'DESC']
          ],
          raw: true,
          nest: true
        }
      )

      await restaurant.increment('viewCounts', { by: 1 })
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        comments,
        isFavorited: restaurant.FavoritedUsers.some(f => f.id === req.user.id),
        isLiked: restaurant.LikedUsers.some(f => f.id === req.user.id)
      })
    } catch (error) {
      next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.rest_id,
        {
          include: [Category],
          nest: true,
          raw: true
        }
      )
      if (!restaurant) throw new Error("Restaurant didn't exist!") // didnot find a restaurant

      const comments = await Comment.findAndCountAll(
        {
          where: {
            restaurantId: req.params.rest_id
          }
        }
      )

      return res.render('dashboard', {
        restaurant,
        commentCounts: comments.count
      })
    } catch (error) {
      next(error)
    }
  },
  getFeeds: async (req, res, next) => { // render top 10 feeds
    try {
      const [restaurants, comments] = await Promise.all(
        [
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
        ]
      )

      return res.render('feeds', {
        restaurants,
        comments
      })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = restaurantController
