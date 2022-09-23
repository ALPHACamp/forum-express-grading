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
        return res.render('restaurants', { restaurants: data })
      })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category mode
      raw: true,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("The restaurant doesn't exist!")
        return res.render('restaurant', { restaurant })
      })
  }
}

module.exports = restaurantController
