const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helper/file-helpers')
const handlebars = require('handlebars')
handlebars.registerHelper('addOne', function (value) {
  return value + 1
})

const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
  },

  createRestaurant: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },

  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body

    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req // 把檔案從 req 拿出來
    imgurFileHandler(file) // 將取出的檔案交給 file-helpers.js 處理
      .then(filePath => Restaurant.create({ // 再 create 這筆資料
        name,
        tel,
        address,
        openingHours,
        description,
        categoryId,
        image: filePath || null
      }))
      .then(() => {
        req.flash('success_messages', 'restaurant is successfully created!')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },

  editRestaurant: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req

    Promise.all([
      Restaurant.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          categoryId,
          image: filePath || restaurant.image
        })
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant was successfully to update!')
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
    return User.findAll({ raw: true })
      .then(users => res.render('admin/users', { users }))
  },

  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        return user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
