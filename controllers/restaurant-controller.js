const { Category, Restaurant } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: [Category],
      raw: true,
      nest: true
    })
      .then(restaurant => {
        const data = restaurant.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: data })
      })
  }
}

module.exports = restaurantController
