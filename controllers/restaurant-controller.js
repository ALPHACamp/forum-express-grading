const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        include: Category,
        nest: true,
        raw: true
      })

      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))

      return res.render('restaurants', {
        restaurants: data
      })
    } catch (err) {
      console.error(err)
      return res.status(500).send('Internal Server Error')
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      })

      if (!restaurant) {
        throw new Error("Restaurant doesn't exist!")
      }

      await Restaurant.increment('viewCounts', {
        where: { id: req.params.id }
      })

      const updatedRestaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      })

      res.render('restaurant', {
        restaurant: updatedRestaurant
      })
      console.log(restaurant)
    } catch (err) {
      console.error(err)
      return next(err)
    }
  },

  getDashboard: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true,
        raw: true
      })

      if (!restaurant) {
        throw new Error("Restaurant doesn't exist!")
      }

      res.render('dashboard', {
        restaurant
      })
    } catch (err) {
      console.error(err)
      return next(err)
    }
  }
}

module.exports = restaurantController
