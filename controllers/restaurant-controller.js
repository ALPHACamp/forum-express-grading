const { Restaurant, Category, Comment, User, Favorite } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

module.exports = {
  async getRestaurants (req, res, next) {
    try {
      const DEFAULT_LIMIT = 9
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

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
          description: restaurant.description.substring(0, 50)
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
        include: [Category, { model: Comment, include: User }],
        order: [[Comment, 'createdAt', 'DESC']]
      })

      await restaurant.increment('viewCounts')
      res.render('restaurant', {
        restaurant: restaurant.toJSON()
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
      req.flash('success_messages', 'Success to add favorite')
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
      req.flash('success_messages', 'Success to reomve the favorite')
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}
