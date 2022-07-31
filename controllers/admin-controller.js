const { Restaurant } = require('../models')
const adminController = {

  getRestaurants: (req, res, next) => {
    // return res.render('admin/restaurants')
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurants: (req, res) => {
    res.render('admin/create-restaruants')
  },
  postRestaurants: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    Restaurant.create({
      name, tel, address, openingHours, description
    })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaruants')
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant didn texist!')
        res.render('admin/restaruant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    const id = req.params.id
    Restaurant.findByPk(id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant didn texist!')
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const id = req.params.id
    Restaurant.findByPk(id)
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant didnt exist!')
        return restaurant.update({
          name, tel, address, openingHours, description
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully updated')
        res.redirect('/admin/restaruants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id)
      .then(restaurant => {
        restaurant.destroy()
      })
      .then(() => {
        res.redirect('/admin/restaruants')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
