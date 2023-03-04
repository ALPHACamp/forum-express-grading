const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurants => {
        const data = restaurants.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist.")
        restaurant.increment('view_counts')
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      include: Category
    })
      .then(restaurant => res.render('dashboard', { restaurant: restaurant.toJSON() }))
      .catch(error => next(error))
  }
}

module.exports = restaurantController
