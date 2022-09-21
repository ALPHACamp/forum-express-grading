const { Restaurant, Category, Comment, User, sequelize } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  // show restaurants according to the selected category and page
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT_ITEMS_PER_PAGE = 9
    // no query (NaN) and All (0): categoryId = ''
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT_ITEMS_PER_PAGE
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        where: categoryId ? { categoryId } : {},
        limit,
        offset,
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ]).then(([restaurants, categories]) => {
      // create user's favorite/like restaurants id set
      const [favoritedRestaurantsId, likedRestaurantsId] = [new Set(), new Set()]
      req.user.FavoritedRestaurants.forEach(fr => favoritedRestaurantsId.add(fr.id))
      req.user.LikedRestaurants.forEach(lr => likedRestaurantsId.add(lr.id))

      const data = restaurants.rows.map(r => {
        if (r.description.length >= 50) {
          r.description = r.description.substring(0, 47) + '...'
        }
        // add isFavorited/isLiked key to show proper button
        r.isFavorited = favoritedRestaurantsId.has(r.id)
        r.isLiked = likedRestaurantsId.has(r.id)
        return r
      })

      return res.render('restaurants', {
        restaurants: data, // show restaurants
        categories, // show categories navbar
        categoryId, // show the selected category
        pagination: getPagination(limit, page, restaurants.count) // show pagination
      })
    }).catch(e => next(e))
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ],
        order: [[Comment, 'createdAt', 'DESC']],
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant doesn't exist!")
      await restaurant.increment('viewCounts', { by: 1 })
      const isFavorited = restaurant.FavoritedUsers.some(fu => fu.id === req.user.id)
      const isLiked = restaurant.LikedUsers.some(lu => lu.id === req.user.id)
      res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
    } catch (e) {
      next(e)
    }
  },

  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, Comment],
      nest: true
    }).then(restaurant => {
      if (!restaurant) throw new Error("Restaurant doesn't exist!")
      res.render('dashboard', { restaurant: restaurant.toJSON() })
    }).catch(e => next(e))
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
        console.log(restaurants, comments)
        res.render('feeds', { restaurants, comments })
      })
      .catch(e => next(e))
  },

  getTopRestaurants: (req, res, next) => {
    return Restaurant
      .findAll({
        include: [{ model: User, as: 'FavoritedUsers' }]
      })
      .then(topRestaurants => {
        const restaurants = topRestaurants.map(r => ({
          ...r.toJSON(),
          description: r.description.length >= 150 ? r.description.substring(0, 147) + '...' : r.description,
          favoritedCount: r.FavoritedUsers.length,
          isFavorited: req.user && req.user.FavoritedRestaurants.some(fr => fr.id === r.id)
        }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)

        res.render('top-restaurants', { restaurants })
      })
      .catch(e => next(e))
  }
}

module.exports = restaurantController
