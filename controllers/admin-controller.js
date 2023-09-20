const { Restaurant, User } = require('../models')
const { localFileHandler } = require('../helpers/file-helper')
const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
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
    const { file } = req
    return localFileHandler(file)
      .then(filePath => {
        Restaurant.create({ name, tel, address, openingHours, description, image: filePath || null }) // create a new Restaurant instance and store in database
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created') // show success information
        res.redirect('/admin/restaurants') // redirect back to index when data is created successfully
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") // if can't find restaurantId throw error message and stop execute below code
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body // get data in from by req.body
    if (!name) throw new Error('Restaurant name is required!') // name is required, if null this function would be terminated and error message would be showed
    const { file } = req// 把檔案取出來
    return Promise.all([
      Restaurant.findByPk(req.params.id), // 去資料庫查有沒有這間餐廳
      localFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([restaurant, filePath]) => { // 以上兩樣事都做完以後
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({ name, tel, address, openingHours, description, image: filePath || restaurant.image })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully updated')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true
    })
      .then(users => res.render('admin/users', { users }))
      .catch(err => next(err))
  },
  patchUsers: () => {}
}
module.exports = adminController
