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
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then((restaurant) => {
        if (!restaurant) throw new Error(`This restaurant doesn't exist!`)

        res.render('admin/restaurant', { restaurant })
      })
      .catch((error) => next(error))
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then((restaurant) => {
        if (!restaurant) throw new Error(`This restaurant doesn't exist!`)

        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch((error) => next(error))
  },
  putRestaurant: (req, res, next) => {
    // 1. take out data from req.body
    const { name, tel, address, openingHours, description } = req.body

    // 2. make sure restaurant name is not null
    if (!name) throw new Error('Restaurant name is required field!')

    // 3. find by primary key: id
    // `restaurant` is insatnce of Restaurant
    // not necessary to change data into plain object, don't add { raw: true }
    // 4. update data getting from req.body
    Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        if (!restaurant) throw new Error(`This restaurant doesn't exist!`)
        return restaurant.update({ name, tel, address, openingHours, description })
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant was updated successfully!')
        res.redirect('/admin/restaurants')
      })
      .catch((error) => next(error))
  },
}

module.exports = adminController
