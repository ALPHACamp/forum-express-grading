const { Op } = require('sequelize')
const { Restaurant } = require('../models')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('restaurants', { restaurants }))
      .catch(err => next(err))
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
