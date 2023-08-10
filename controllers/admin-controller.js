
const { Restaurant, User, Category } = require('../models')

const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {

  // (頁面) 顯示餐廳管理清單
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  // (頁面) 顯示單一餐廳詳細資料
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  // (頁面) 顯示新增餐廳表單
  createRestaurant: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },
  // (功能) 新增餐廳
  postRestaurant: (req, res, next) => {
    const { name, categoryId, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req
    return imgurFileHandler(file) // 把取出的檔案傳給 file-helper 處理
      .then(filePath => Restaurant.create({
        name,
        categoryId,
        tel,
        address,
        openingHours,
        description,
        image: filePath || undefined // 將檔案路徑存在image中
      }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created.')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  // (頁面) 顯示修改餐廳表單
  editRestaurant: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  // (功能) 修改餐廳
  putRestaurant: (req, res, next) => {
    const { name, categoryId, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req
    return Promise.all([
      Restaurant.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")

        return restaurant.update({
          name,
          categoryId,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was updated successfully.')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  // (功能) 刪除餐廳
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  // (頁面) 顯示使用者清單
  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => {
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },
  // (功能) 修改使用者權限
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }

        user.update({ isAdmin: !user.isAdmin })
          .then(() => {
            req.flash('success_messages', '使用者權限變更成功')
            return res.redirect('/admin/users')
          })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
