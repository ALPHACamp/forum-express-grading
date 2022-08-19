const { Restaurant, Category } = require('../models')
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
      const data = restaurants.rows.map(restaurant => {
        if (restaurant.description.length >= 50) {
          restaurant.description = restaurant.description.substring(0, 47) + '...'
        }
        return restaurant
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
      const restaurant = await Restaurant.findByPk(req.params.id, { include: Category, nest: true })
      if (!restaurant) throw new Error("Restaurant doesn't exist!")
      await restaurant.increment('viewCounts', { by: 1 })
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (e) {
      next(e)
    }
  },

  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    }).then(restaurant => {
      if (!restaurant) throw new Error("Restaurant doesn't exist!")
      res.render('dashboard', { restaurant })
    }).catch(e => next(e))
  }
}

module.exports = restaurantController
