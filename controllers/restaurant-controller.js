const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
  },
  getRestaurant: async (req, res, next) => {
    await Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        console.log(restaurant.viewCounts)
        restaurant.increment('viewCounts')
        console.log(restaurant.viewCounts)
        res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },
  getDashboard: async (req, res, next) => {
    await Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController