const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      include: Category,
      nest: true
    }).then(restaurants => {
      const data = restaurants.map(r => {
        return { ...r, description: r.description.substring(0, 50) }
      })
      // console.log(data) // [{...},{...}]
      return res.render('restaurants', {
        restaurants: data
      })
    })
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: Category,
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.increment('view_counts')
      // await restaurant.reload()
      return res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    } catch (err) {
      next(err)
    }
  },
  getDashboard: async (req, res, next) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
    if (!restaurant) throw new Error("Restaurant didn't exist!")
    // console.log('restaurant', restaurant.viewCounts)

    // console.log('restaurant2', typeof (restaurant.viewCounts))
    res.render('dashboard', {
      restaurant
    })
  }
}
module.exports = restaurantController
