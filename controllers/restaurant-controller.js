const { Restaurant, Category, Comment, User, Sequelize } = require('../models')
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
  async getTopRestaurants (req, res, next) {
    try {
      const favoritedRestaurantsId = req.user && req.user.FavoritedRestaurants.map(fr => fr.id)
      const topFavors = await Restaurant.findAll({
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.col('FavoritedUsers.id')), 'favoritedCount']
          ]
        },
        include: [{
          model: User,
          as: 'FavoritedUsers',
          attributes: [],
          through: { attributes: [] },
          mapToModel: true,
          required: false
        }],
        group: ['Restaurant.id'],
        order: [[Sequelize.literal('favoritedCount'), 'DESC']],
        limit: 10,
        raw: true,
        nest: true,
        subQuery: false
      })
      /*
      const topFavors = await sequelize.query(
        `
        SELECT a.*, COUNT(b.user_id) favoritedCount
        FROM restaurants a
        LEFT JOIN favorites b
        ON  a.id = b.restaurant_id
        GROUP BY a.id
        ORDER BY favoritedCount DESC
        LIMIT 10;
        `,
        {
          // model: Restaurant,
          // mapToModel: true,
          type: sequelize.QueryTypes.SELECT
          // raw: true
        }
      )
      // console.log(topFavors)
      */
      const restaurants = Object.keys(topFavors[0]).includes('favoritedCount')
        ? topFavors.map(restaurant => ({
          ...restaurant,
          isFavorited: favoritedRestaurantsId?.includes(restaurant.id)
        }))
        : topFavors.map(rec => ({
          ...rec.toJSON(),
          favoritedCount: rec.dataValues.FavoritedUsers.length
        })).sort((a, b) => b.favoritedCount - a.favoritedCount)

      res.render('Top 10 人氣餐廳', { restaurants })
    } catch (err) {
      next(err)
    }
  }
}
