const { Restaurant, Category } = require('../models')
const { RestaurantError } = require('../errors/errors')
const restaurantController = {
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
      console.log('typeof id :', typeof id)
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      if (!restaurant) {
        throw new RestaurantError('Restaurant did not exist!')
      }
      return res.render('restaurant', { restaurant })
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = { restaurantController }
