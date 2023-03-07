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
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 拿出關聯的 Category model
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant', {
          restaurant
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
