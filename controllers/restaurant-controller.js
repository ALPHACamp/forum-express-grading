const { Restaurant, Category } = require('../models')

const restaurantController = {
  // 使用者瀏覽前台所有餐廳
  getRestaurants: async (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: Category, where: { ...categoryId ? { categoryId } : {} } })
      const data = restaurants.map(rest => ({ ...rest, description: rest.description.substring(0, 50) }))
      return res.render('restaurants', { categoryId, categories, restaurants: data })
    } catch (e) {
      next(e)
    }
  },
  // 使用者瀏覽單筆餐廳資料
  getRestaurant: async (req, res, next) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true, include: Category })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await Restaurant.increment('viewCounts', { where: { id } })
      return res.render('restaurant', { restaurant })
    } catch (e) {
      next(e)
    }
  },
  // 使用者查看單筆餐廳Dashboard
  getDashboard: async (req, res, next) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true, include: Category })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('dashboard', { restaurant })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = restaurantController
