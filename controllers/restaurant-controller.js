const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  },

  getRestaurant: async (req, res, next) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, {
        include: Category,
        nest: true,
        raw: true
      })
      if (!restaurant) throw new Error('Restaurant didn\'t exist!')
      res.render('restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = restaurantController
