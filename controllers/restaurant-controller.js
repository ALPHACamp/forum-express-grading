const { Restaurant, Category, Comment, User, Favorite, Like } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

module.exports = {
  async getRestaurants (req, res, next) {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const likedRestaurantsId = req.user && req.user.LikedRestaurants.map(lr => lr.id)
      const categoryId = Number(req.query.categoryId) || ''
      const [restaurants, categories] = await Promise.all([
        Restaurant.findAndCountAll({
          where: {
            ...categoryId ? { categoryId } : {}
          },
          limit,
          offset,
          raw: true,
          include: Category,
          nest: true
        }),
        Category.findAll({ raw: true })
      ])

      res.render('restaurants', {
        restaurants: restaurants.rows.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50),
          isFavorited: favoritedRestaurantsId?.includes(restaurant.id),
          isLiked: likedRestaurantsId?.includes(restaurant.id)
        })),
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (err) {
      next(err)
    }
  },
  async getRestaurant (req, res, next) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ],
        order: [[Comment, 'createdAt', 'DESC']]
      })

      await restaurant.increment('viewCounts')
      res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited: restaurant.FavoritedUsers.some(fu => fu.id === req.user.id),
        isLiked: restaurant.LikedUsers.some(lu => lu.id === req.user.id)
      })
    } catch (err) {
      next(err)
    }
  },
  async getDashboard (req, res, next) {
    try {
      const restaurant = (await Restaurant.findByPk(req.params.id, {
        include: [Category, Comment]
      })).toJSON()

      res.render('dashboard', { restaurant, commentCounts: restaurant?.Comments?.length || 0 })
    } catch (err) {
      next(err)
    }
  },
  async getFeeds (_req, res, next) {
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
          include: [Restaurant, User],
          raw: true,
          nest: true
        })
      ])

      res.render('feeds', { restaurants, comments })
    } catch (err) {
      next(err)
    }
  },
  async addFavorite (req, res, next) {
    try {
      const restaurantId = req.params.id
      const userId = req.user.id
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({ where: { userId, restaurantId } })
      ])

      if (!restaurant) throw new Error('The Restaurant does not exist')
      if (favorite) throw new Error('You have favorited this restaurant')
      await Favorite.create({ userId, restaurantId })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  async removeFavorite  (req, res, next) {
    try {
      const favorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.id
        }
      })

      if (!favorite) throw new Error("You haven't favorited this restaurant")
      await favorite.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  async addLike (req, res, next) {
    try {
      const userId = req.user.id
      const restaurantId = req.params.id
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({ where: { userId, restaurantId } })
      ])

      if (!restaurant) throw new Error('The Restaurant does not exist')
      if (like) throw new Error('You have liked this restaurant')
      await Like.create({ userId, restaurantId })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  async removeLike (req, res, next) {
    try {
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.id
        }
      })

      if (!like) throw new Error("You haven't liked this restaurant")
      await like.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}
