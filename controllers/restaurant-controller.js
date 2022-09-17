const { Restaurant } = require('../models')

exports.getRestaurants = async (req, res, next) => {
  try {
    const pageSize = 15
    const currPage = +req.query.page || 1
    const { count, rows } = await Restaurant.findAndCountAll({
      offset: (currPage - 1) * pageSize,
      limit: pageSize
    })
    if (currPage > Math.ceil(count / pageSize)) {
      req.flash('error_messages', '頁面不存在')
      return res.redirect('/restaurants')
    }
    const pages = Array.from({ length: Math.ceil(count / pageSize) }, (_, i) => Number(i + 1))
    const restaurants = rows.map(({ dataValues }) => dataValues)
    const nextPage = currPage === pages.length ? 0 : currPage + 1
    const prevPage = currPage - 1
    return res.render('restaurants', { restaurants, pages, nextPage, prevPage, currPage: String(currPage) })
  } catch (err) {
    next(err)
  }
}

exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, { raw: true })
    if (!restaurant) {
      throw new Error('Restaurant not found')
    }
    return res.render('restaurant', { restaurant })
  } catch (error) {
    next(error)
  }
}
