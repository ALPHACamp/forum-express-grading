const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category, //拿出關聯的 Category model
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('restaurant', { restaurant: restaurant.toJSON() })
        restaurant.viewCounts += 1
        return restaurant.save()
      })
      .catch(err => console.log(err))
  },
  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      include: Category,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(err => console.log(err))
  }
}
module.exports = restaurantController
