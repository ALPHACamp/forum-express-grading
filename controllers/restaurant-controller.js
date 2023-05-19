const { Restaurant, Category } = require('../models')

const restaurantController = {
  // 使用者瀏覽前台所有餐廳
  getRestaurants: async (req, res, next) => {
    const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: Category })
    const data = restaurants.map(rest => ({ ...rest, description: rest.description.substring(0, 50) }))
    return res.render('restaurants', { restaurants: data })
  },
  // 使用者瀏覽單筆餐廳資料
  getRestaurant: async (req, res, next) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true, include: Category })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('restaurant', { restaurant })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = restaurantController
