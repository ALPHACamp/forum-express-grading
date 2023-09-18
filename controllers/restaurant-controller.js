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
      return res.render('restaurants', { restaurants: data })
    })
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      include: Category,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) { throw new Error("Restaurant didn't exist!") }
        return restaurant.increment('viewCounts')
      })
      .then(updateRestaurant => res.render('restaurant', { restaurant: updateRestaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) { throw new Error("Restaurant didn't exist") }
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
