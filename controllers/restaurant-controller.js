const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({ ...r, description: r.description.substring(0, 50) }))
        return res.render('restaurants', { restaurants: data })
      })
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        return restaurant.increment({ viewCounts: 1 })
      })
      .then(restaurant => {
        const data = restaurant.toJSON()
        return res.render('restaurant', { restaurant: data })
      })
      .catch(err => next(err))

    // return Restaurant.findByPk(req.params.id, { include: Category })
    //   .then(rest => { return rest.update({ viewCounts: rest.viewCounts + 1 }) })
    //   .then(rest => {
    //     rest = rest.toJSON()
    //     return res.render('restaurant', { restaurant: rest })
    //   })
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurant => {
        return res.render('dashboard', { restaurant })
      })
  }
}
module.exports = restaurantController
