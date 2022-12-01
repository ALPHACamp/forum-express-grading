const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([Restaurant.findAll({
      include: Category, // 關聯資料
      where: {
        ...categoryId ? { categoryId } : {} // ...擴展運算子優先權較低，會先做三元運算子比較過後再展開
      },
      nest: true,
      raw: true
    }),
    Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data, categories, categoryId })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category // 關聯資料
    }).then(restaurant => {
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return restaurant.increment('viewCounts', { by: 1 })
    }).then(restaurant => {
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    }).catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 關聯資料
      raw: true,
      nest: true
    })
      .then(restaurant => {
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
