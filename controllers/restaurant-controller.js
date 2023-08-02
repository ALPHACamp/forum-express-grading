const { Restaurant, Category } = require('../models')
const { RestaurantError } = require('../errors/errors')
const restController = {
  getRestaurants: async (req, res, next) => {
    try {
      /** 被soft delete的東西長下面這樣 還是會有category
      Category: {
          id: null,
          name: null,
          deletedAt: null,
          createdAt: null,
          updatedAt: null
        }
      */
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      const data = restaurants.map(restaurant => {
        return {
          ...restaurant, // 把restaurant展開後塞進新的object
          description: restaurant.description.substring(0, 50)
        }
      })
      return res.render('restaurants', { restaurants: data })
    } catch (error) {
      return next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, {
        nest: true,
        include: [Category]
      })
      if (!restaurant) {
        throw new RestaurantError('Restaurant did not exist!')
      }

      await restaurant.increment('viewCounts', { by: 1 })
      await restaurant.reload() // increment後需要重新reload才會抓到更新後的值
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      return next(error)
    }
  },
  getDashboard: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, {
        nest: true,
        include: [Category]
      })
      if (!restaurant) {
        throw new RestaurantError('Restaurant did not exist!')
      }
      return res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = restController
