const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    try {
      // 取出restaurants(含category)
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      // 對於description進行處理(substring)
      const data = restaurants.map(restaurant => ({
        ...restaurant,
        description: restaurant.description.substring(0, 50)
      }))
      // render
      return res.render('restaurants', { restaurants: data })
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    // 取出id值
    const { id } = req.params
    try {
      // 找出對應restaurant
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true, include: [Category] })
      // 找不到報錯
      if (!restaurant) throw new Error('Restaurant does not exist!')
      // 找到就render
      return res.render('restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = restaurantController
