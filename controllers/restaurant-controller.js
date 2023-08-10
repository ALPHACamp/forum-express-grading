const { Restaurant, Category } = require('../models') // 引入資料庫

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    // const where = {}
    // if (categoryId) where.CategoryId = categoryId
    return Promise.all([
      Restaurant.findAll({
        include: Category,
        where: {
          ...categoryId ? { CategoryId: categoryId } : {}
        },
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ]).then(([restaurants, categories]) => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId
      })
    })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('viewCounts', { by: 1 })
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
