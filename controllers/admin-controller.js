const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers') // 將 file-helper 載進來

const adminController = {
  // for all restaurants
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true, // 做關聯的 category 物件 key 名字簡單化
      include: [Category]
    })
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
    // use form data from req.body
    const { name, tel, address, openingHours, description, categoryId } = req.body
    // double check name exists!! if doesn't exist, trow error message
    if (!name) throw new Error('Restaurant name is required!')
    // else(name exist) create the restaurant data, which data from req.body
    // for image upload, 把檔案取出來，也可以寫成 const file = req.file
    const { file } = req
    imgurFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      .then(filePath => Restaurant.create({ // 再 create 這筆餐廳資料
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        // finish create new restaurant, redirect to admin home page
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  // for one restaurant view
  getRestaurant: (req, res, next) => {
    // SQLize use "id" to find one data
    return Restaurant.findByPk(req.params.id, {
      // clean data no SQLize operate
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // if cannot find, throw error message and end of this code
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  // for one restaurant edit view
  editRestaurant: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  // for one restaurant edit update
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    // for image upload
    // 把檔案取出來
    const { file } = req
    // 非同步處理，這裡沒有先後順序 -> promise.all
    Promise.all([
      // 去資料庫查有沒有這間餐廳
      Restaurant.findByPk(req.params.id),
      // 把檔案傳到 file-helper 處理
      imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => { // 以上兩樣事都做完以後
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({ // 修改這筆資料
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  // for delete one restaurant
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  // =======================================
  // for auth management
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true
    })
      .then(users => res.render('admin/auth-management', { users }))
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        if (user.isAdmin) {
          return user.update({ isAdmin: false })
        } else {
          return user.update({ isAdmin: true })
        }
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
