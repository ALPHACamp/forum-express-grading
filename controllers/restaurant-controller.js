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
      include: [Category],
      raw: true,
      nest: true
    })
    const restaurant = nullCategoryHandle(data)
    res.render('restaurant', { restaurant })
  }
}

module.exports = restaurantController
