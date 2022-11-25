const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({ include: Category, nest: true, raw: true })
      .then(restaurants => {
        if (!restaurants.length) return req.flash('error_messages', 'No restaurant is found!')
        const datas = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', { restaurants: datas })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
