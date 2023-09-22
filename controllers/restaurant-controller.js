const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
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
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
