/* eslint-disable array-callback-return */
const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
      raw: true,
      nest: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r, description: r.description.substring(0, 50)
      }))
      // const data = restaurants.map(r => {
      //   r.description = r.description.substring(0, 50)
      //   return r
      // })
      return res.render('restaurants', { restaurants: data })
    })
  }
}

module.exports = restaurantController
