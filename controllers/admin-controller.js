const { Restaurant } = require('../models') // 新增這裡 採用解構賦值

const adminController = { // 修改這裡

  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant is required')
    Restaurant.create({ name, tel, address, openingHours, description })
      .then(() => {
        req.flash('success_msg', 'Restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    Restaurant.findByPk(id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant is required')
    Restaurant.findByPk(req.params.id) // 這裡不加{ raw: true }
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        return restaurant.update({ name, tel, address, openingHours, description }) // 因為才可以直接操作資料庫
      })
      .then(() => {
        req.flash('success_msg', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist")
        return restaurant.destroy()
      })
      .then(() => {
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
