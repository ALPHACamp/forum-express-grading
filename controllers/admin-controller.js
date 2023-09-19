const { Restaurant } = require('../models')
const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body // get data in from by req.body
    if (!name) throw new Error('Restaurant name is required!') // name is required, if null this function would be terminated and error message would be showed
    Restaurant.create({ name, tel, address, openingHours, description }) // create a new Restaurant instance and store in database
      .then(() => {
        req.flash('success_msg', 'restaurant was successfully created') // show success information
        res.redirect('/admin/restaurants') // redirect back to index when data is created successfully
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") // if can't find restaurantId throw error message and stop execute below code
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
