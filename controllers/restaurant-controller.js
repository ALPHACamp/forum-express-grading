const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      raw: true,
      nest: true
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
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error('The restaurant does not exist.')
<<<<<<< HEAD
        console.log(restaurant.toJSON())
        restaurant.update({
          viewCounts: restaurant.toJSON().viewCounts + 1
        })
        return restaurant.toJSON()
      })
      .then(restaurant => res.render('restaurant', { restaurant }))
      .catch(err => next(err))
  },
  getRestaurantDashboard: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
=======
        // restaurant.update({
        //   viewCounts: restaurant.toJSON().viewCounts + 1
        // })
        // return restaurant.toJSON()
        return restaurant.increment('viewCounts')
      })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
>>>>>>> R02
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('The restaurant does not exit.')
        res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
