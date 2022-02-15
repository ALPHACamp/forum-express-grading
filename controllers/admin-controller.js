const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },

  createRestaurant: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },

  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body

    // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    if (!name) throw new Error('請輸入餐廳名稱')

    // 把取出的檔案傳給 file-helper 處理後
    const { file } = req
    return imgurFileHandler(file)
      .then(filePath =>
        Restaurant.create({ name, tel, address, openingHours, description, image: file ? filePath : null, categoryId })
      )
      .then(() => {
        req.flash('success_messages', '餐廳新增成功')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error('餐廳不存在')
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },

  editRestaurant: (req, res, next) => {
    Promise.all([Restaurant.findByPk(req.params.id, { raw: true }), Category.findAll({ raw: true })])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error('餐廳不存在')
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    const id = req.params.id
    if (!name) throw new Error('請輸入餐廳名稱')

    const { file } = req // 把檔案取出來
    return Promise.all([Restaurant.findByPk(id), imgurFileHandler(file)])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error('餐廳不存在')
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: file ? filePath : restaurant.image,
          categoryId
        })
      })
      .then(() => {
        req.flash('success_animation', id)
        req.flash('success_messages', '餐廳更新成功')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error('餐廳不存在')
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },

  // users
  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => res.render('admin/users', { users }))
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    const id = req.params.id

    return User.findByPk(id)
      .then(user => {
        // superuser
        if (user.email === process.env.SUPERUSER_EMAIL) {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        // common user
        return user.update({ isAdmin: !user.isAdmin }).then(() => {
          req.flash('success_animation', id)
          req.flash('success_messages', '使用者權限變更成功')
          return res.redirect('/admin/users')
        })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
