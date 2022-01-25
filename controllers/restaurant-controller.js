const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      include: [Category],
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
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category],
      raw: true,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist")

        res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
