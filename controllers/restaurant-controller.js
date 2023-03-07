const { Op } = require('sequelize')
const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: Category,
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
  getRestaurantsByName: (req, res, next) => {
    const keyword = req.query.keyword

    if (keyword) {
      return Restaurant.findAll({
        where: {
          name: {
            [Op.like]: `%${keyword}%`
          }
        },
        raw: true
      })
        .then(restaurants => res.render('restaurants', { restaurants, keyword }))
    } else {
      res.render('restaurants')
    }
  }
}
module.exports = restaurantController
