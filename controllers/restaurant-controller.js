const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Promise.all([
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: [Category],
        where: {
          ...categoryId ? { categoryId } : {}
        },
        limit,
        offset
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(restaurant =>
          ({
            ...restaurant,
            description: restaurant.description.substring(0, 50)
          }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      nest: true,
      include: [
        Category,
        {
          model: Comment,
          include: User
        }
      ],
      order: [[Comment, 'createdAt', 'DESC']]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('restaurant not found')

        restaurant.update({ viewCounts: restaurant.viewCounts + 1 })
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      nest: true,
      include: [Category, Comment]
    })
      .then(restaurant => {
        console.log(restaurant.toJSON())
        if (!restaurant) throw new Error('restaurant not found')
        return res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(error => next(error))
  }
}
module.exports = restaurantController
