<<<<<<< HEAD
const { Restaurant } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
=======
const { Restaurant, User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
>>>>>>> R01

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
<<<<<<< HEAD
      .then((restaurants) => res.render('admin/restaurants', { restaurants }))
      .catch((err) => next(err))
=======
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
>>>>>>> R01
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('餐廳名稱為必填')
    const { file } = req
<<<<<<< HEAD
    localFileHandler(file)
      .then((filePath) =>
=======
    imgurFileHandler(file)
      .then(filePath =>
>>>>>>> R01
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
<<<<<<< HEAD
      .catch((err) => next(err))
=======
      .catch(err => next(err))
>>>>>>> R01
  },
  getRestaurant: (req, res, next) => {
    const { id } = req.params
    Restaurant.findByPk(id, { raw: true })
<<<<<<< HEAD
      .then((restaurant) => {
        if (!restaurant) throw new Error('查無此餐廳')
        res.render('admin/restaurant', { restaurant })
      })
      .catch((err) => next(err))
=======
      .then(restaurant => {
        if (!restaurant) throw new Error('查無此餐廳')
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
>>>>>>> R01
  },
  editRestaurant: (req, res, next) => {
    const { id } = req.params
    Restaurant.findByPk(id, { raw: true })
<<<<<<< HEAD
      .then((restaurant) => {
        if (!restaurant) throw new Error('查無此餐廳')
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch((err) => next(err))
=======
      .then(restaurant => {
        if (!restaurant) throw new Error('查無此餐廳')
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
>>>>>>> R01
  },
  putRestaurant: (req, res, next) => {
    const { id } = req.params
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('餐廳名稱為必填')
    const { file } = req
<<<<<<< HEAD
    Promise.all([Restaurant.findByPk(id), localFileHandler(file)])
=======
    Promise.all([Restaurant.findByPk(id), imgurFileHandler(file)])
>>>>>>> R01
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
<<<<<<< HEAD
      .catch((err) => next(err))
=======
      .catch(err => next(err))
>>>>>>> R01
  },
  deleteRestaurant: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findByPk(id)
<<<<<<< HEAD
      .then((restaurant) => {
=======
      .then(restaurant => {
>>>>>>> R01
        if (!restaurant) throw new Error('查無此餐廳')
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
<<<<<<< HEAD
      .catch((err) => next(err))
=======
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => res.render('admin/restaurants', { users }))
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id)
      .then(user => {
        if (user.name === 'admin') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        user.update({ isAdmin: !user.isAdmin })
          .then(() => {
            req.flash('success_messages', '使用者權限變更成功')
            res.redirect('/admin/users')
          })
      })
      .catch(err => next(err))
>>>>>>> R01
  }
}

module.exports = adminController
