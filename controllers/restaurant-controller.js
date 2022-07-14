const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({
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

    Restaurant.findByPk(id, {
      nest: true,
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant does not exist!')

        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        restaurant = restaurant.toJSON()
        res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id

    return Restaurant.findByPk(id, {
      nest: true,
      include: Category,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant does not exist!')

        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
