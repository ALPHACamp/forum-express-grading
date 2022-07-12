const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res) => {
    const restaurants = await Restaurant.findAll({
      raw: true,
      nest: true,
      include: Category
    })
    const data = restaurants.map(r => ({
      ...r,
      description: r.description.substring(0, 50)
    }))
    res.render('restaurants', { restaurants: data })
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
