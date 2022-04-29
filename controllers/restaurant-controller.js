const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true,
      where: { ...categoryId ? { categoryId } : {} }
    }), Category.findAll({ raw: true })])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r, description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data, categories, categoryId })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category, nest: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        restaurant.increment('viewCount')
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('dashboard', { restaurant })
      })
  }
}
module.exports = restaurantController
