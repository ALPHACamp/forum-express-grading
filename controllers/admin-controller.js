const { Restaurant } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurants: (req, res) => {
    return res.render('admin/create-restaurant.hbs')
  },
  postRestaurants: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    const { file } = req
    if (!name) throw new Error('Restaurant name is required!')
    localFileHandler(file)
      .then(filePath => Restaurant.create({ name, tel, address, openingHours, description, image: filePath || null }))
      .then(() => {
        req.flash('success_msg', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.restId, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurants: (req, res, next) => {
    Restaurant.findByPk(req.params.restId, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  putRestaurants: (req, res, next) => {
    const restId = req.params.restId
    const { name, tel, address, openingHours, description } = req.body
    const { file } = req
    if (!name) throw new Error('Restaurant name is required!')
    Promise.all([ // 非同步處理
      Restaurant.findByPk(restId),
      localFileHandler(file)
    ])
      .then(([restaurant, filePath]) => { // 以上兩樣事都做完以後
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image
        })
      })
      .then(() => {
        req.flash('success_msg', 'restaurant was successfully to update')
        res.redirect(`/admin/restaurants/${restId}`)
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.restId)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }

}

module.exports = adminController
