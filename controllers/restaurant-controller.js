const { Restaurant, Category, Comment, User } = require('../models')

exports.getRestaurants = async (req, res, next) => {
  try {
    const pageSize = 15
    const currPage = +req.query.page || 1
    const categoryId = +req.query.categoryId || ''
    const { count, rows } = await Restaurant.findAndCountAll({
      offset: (currPage - 1) * pageSize,
      limit: pageSize,
      where: {
        ...categoryId ? { categoryId } : {}
      },
      include: Category,
      nest: true
    })
    const categories = await Category.findAll({
      raw: true
    })
    if (currPage > Math.ceil(count / pageSize)) {
      req.flash('error_messages', '頁面不存在')
      return res.redirect('/restaurants')
    }
    const pages = Array.from({ length: Math.ceil(count / pageSize) }, (_, i) => Number(i + 1))
    const restaurants = rows.map(({ dataValues }) => ({
      ...dataValues,
      description: dataValues.description.substring(0, 50),
      Category: dataValues.Category.dataValues
    }))
    const nextPage = currPage === pages.length ? 0 : currPage + 1
    const prevPage = currPage - 1
    return res.render('restaurants', {
      restaurants,
      pages,
      nextPage,
      prevPage,
      currPage,
      categories,
      categoryId
    })
  } catch (err) {
    next(err)
  }
}

exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      include: [
        Category,
        { model: Comment, include: User }
      ],
      nest: true
    })
    if (!restaurant) {
      throw new Error('Restaurant not found')
    }

    return res.render('restaurant', { restaurant: restaurant.toJSON() })
  } catch (error) {
    next(error)
  }
}

exports.getDashboard = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      include: [
        Category,
        { model: Comment, include: User }
      ],
      nest: true
    })
    if (!restaurant) {
      throw new Error('Restaurant not found')
    }
    const result = await restaurant.update({ viewCount: restaurant.viewCount + 1 })
    return res.render('dashboard', { restaurant: result.toJSON() })
  } catch (error) {
    next(error)
  }
}
