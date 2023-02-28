// 前台使用者用
const { Restaurant, Category } = require('../models')
const { nullCategoryHandle } = require('../helpers/object-helpers')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      const data = await Restaurant.findAll({
        include: [Category],
        raw: true,
        nest: true
      })
      const restaurants = nullCategoryHandle(data)
      res.render('restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    const { id } = req.params
    const data = await Restaurant.findByPk(id, {
      include: [Category]
    })
    await data.increment('view_counts')
    const restaurant = nullCategoryHandle(data.toJSON())
    res.render('restaurant', { restaurant })
  },
  getDashboard: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      res.render('dashboard', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
