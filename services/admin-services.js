const { Restaurant, User, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const adminServices = {
  getRestaurants: (req, cb) => {
    const DEFAULT_LIMIT = 10
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      include: [Category],
      limit,
      offset
    })
      .then(restaurants => cb(null, {
        restaurants: restaurants.rows,
        pagination: getPagination(limit, page, restaurants.count)
      }))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
