const { Restaurant, User } = require('../models/')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurant: (req, res, next) => {
    const id = req.params.id
    Restaurant.findByPk(id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Can not find this restaurant!')
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },

  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
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
        Restaurant.create({
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
    Restaurant.findByPk(req.params.id, {
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
    Promise.all([
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

    Restaurant.findByPk(req.params.id)
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

  getUser: (req, res, next) => {
    User.findAll({
      raw: true
    })
      .then(users => {
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },

  patchUser: (req, res, next) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('Can not find user to patch!')

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
