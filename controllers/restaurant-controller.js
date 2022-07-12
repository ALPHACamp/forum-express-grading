const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data
        })
      })
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      nest: true,
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        const rest = restaurant.toJSON()
        console.log(rest)
        return res.render('restaurant', { restaurant: rest })
      })
      .catch(next)
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(next)
  }
}
module.exports = restaurantController
