const { Restaurant } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const adminController = {
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

    // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    if (!name) throw new Error('Restaurant name is required!')

    // 把取出的檔案傳給 file-helper 處理後
    const { file } = req
    localFileHandler(file)
      .then(filePath => Restaurant.create({ name, tel, address, openingHours, description, image: filePath || null }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },

  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req // 把檔案取出來
    Promise.all([Restaurant.findByPk(req.params.id), localFileHandler(file)])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        return restaurant.update({ name, tel, address, openingHours, description, image: filePath || restaurant.image })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
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
  }
}
module.exports = adminController
