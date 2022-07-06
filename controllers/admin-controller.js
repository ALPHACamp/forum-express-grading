const { Restaurant } = require('../models')
const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then((restaurants) => {
        return res.render('admin/restaurants', { restaurants })
      })
      .catch((error) => next(error))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body

    // make sure restaurant name is not null
    if (!name) throw new Error('Restaurant name is required field!')

    Restaurant.create({ name, tel, address, openingHours, description })
      .then(() => {
        req.flash('success_messages', 'You have created restaurant successfully!')
        res.redirect('/admin/restaurants')
      })
      .catch((error) => next(error))
  },
}

module.exports = adminController
