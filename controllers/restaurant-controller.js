const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        include: Category,
        where: { ...categoryId ? { categoryId } : {} }
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
    const { id } = req.params
    return Promise.all([
      Restaurant.findByPk(id, { raw: true, nest: true, include: Category }),
      Restaurant.increment({ view_counts: 1 }, { where: { id } })
    ])
      .then(([restaurant, viewCounts]) => {
        if (!restaurant) throw new Error('Restaurant didnt exist!')
        return res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, { raw: true, nest: true, include: Category }).then(restaurant => {
      if (!restaurant) throw new Error('Restaurant didnt exist!')
      return res.render('dashboard', { restaurant })
    })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
