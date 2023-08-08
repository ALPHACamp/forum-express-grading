const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      const data = restaurants.map(restaurant =>
        ({
          ...restaurant,
          description: restaurant.description.substring(0, 50)
        }))
      return res.render('restaurants', { restaurants: data })
    })
  },
  getRestaurant: (req, res) => {
    console.log(req.params.id)
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurant => {
      if (!restaurant) throw new Error('restaurant not found')
      return res.render('restaurant', { restaurant })
    })
  }
}
module.exports = restaurantController
