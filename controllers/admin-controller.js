const { Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required.')
    const { file } = req
    imgurFileHandler(file) // 把檔案取出交給file-hepler處理
      .then(filePath => Restaurant.create({ // 回傳filePath檔案路徑
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null // 若資料夾內有image則回傳，無責回傳null
      }))
      .then(() => {
        req.flash('success_msg', 'Restaurant was successfully created.')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist.")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist.")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required.')
    const { file } = req
    Promise.all([
      Restaurant.findByPk(req.params.id), imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return Restaurant.update({ // 使用update前不能先用raw: true轉成Json資料
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image // 若無update則沿用原db內的值
        }, { where: { id: req.params.id } })
      })
      .then(() => {
        req.flash('success_msg', 'Updated successfully.')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist.")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }
}
module.exports = adminController
