const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    }).then(restaurant => {
      const data = restaurant.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', { restaurants: data })
    })
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        res.render('restaurant', {
          restaurant
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
