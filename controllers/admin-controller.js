const { Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then((restaurants) => res.render('admin/restaurants', { restaurants }))
      .catch((err) => next(err))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('餐廳名稱為必填')
    const { file } = req
    imgurFileHandler(file)
      .then((filePath) =>
        Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null
        })
      )
      .then(() => {
        req.flash('success_messages', '餐廳建立成功')
        res.redirect('/admin/restaurants')
      })
      .catch((err) => next(err))
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params
    Restaurant.findByPk(id, { raw: true })
      .then((restaurant) => {
        if (!restaurant) throw new Error('查無此餐廳')
        res.render('admin/restaurant', { restaurant })
      })
      .catch((err) => next(err))
  },
  editRestaurant: (req, res, next) => {
    const { id } = req.params
    Restaurant.findByPk(id, { raw: true })
      .then((restaurant) => {
        if (!restaurant) throw new Error('查無此餐廳')
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch((err) => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { id } = req.params
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('餐廳名稱為必填')
    const { file } = req
    Promise.all([Restaurant.findByPk(id), imgurFileHandler(file)])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error('查無此餐廳')
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
        req.flash('success_messages', '更新餐廳資料成功')
        res.redirect('/admin/restaurants')
      })
      .catch((err) => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id)
      .then((restaurant) => {
        if (!restaurant) throw new Error('查無此餐廳')
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch((err) => next(err))
  }
}

module.exports = adminController
