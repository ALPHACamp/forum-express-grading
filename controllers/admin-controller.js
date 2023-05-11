const { Restaurant, User } = require('../models/')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Can not find this restaurant!')
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },

  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true
    })
      .then(restaurants => {
        res.render('admin/restaurants', { restaurants })
      })
      .catch(err => next(err))
  },

  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },

  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    // 驗證：沒有填名字
    if (!name) throw new Error('Name can not be empty!')

    // 處理file (照片)
    imgurFileHandler(req.file)
      .then(filePath => {
        // 建立餐廳 Record
        return Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null
        })
      })
      .then(() => {
        req.flash('success_messages', `${name} was successfully created!`)
        res.redirect('admin/restaurants')
      })
      .catch(err => next(err))
  },

  editRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Can not find restaurant to edit!')
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    // 驗證：沒有填名字
    if (!name) throw new Error('Name can not be empty!')

    // 找餐廳 ＋ 處理file (照片)
    return Promise.all([
      Restaurant.findByPk(req.params.id),
      imgurFileHandler(req.file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error('Can not find restaurant to edit!')
        // 修改餐廳 update
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
        req.flash('success_messages', `${name} successfully updated!`)
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  deleteRestaurant: (req, res, next) => {
    let name = ''

    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error('Can not find restaurant to delete!')
        name = restaurant.name
        return restaurant.destroy()
      })
      .then(() => {
        req.flash('success_messages', `${name} successfully deleted!`)
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true
    })
      .then(users => {
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },

  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        // 檢查是否有這個 user
        if (!user) throw new Error('Can not find user to patch!')

        // 檢查是否為 root，是就禁止變更，倒回上一頁
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }

        // toggle isAdmin
        return user.update({
          isAdmin: (!user.isAdmin)
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
