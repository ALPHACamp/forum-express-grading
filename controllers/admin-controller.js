const { Restaurant } = require('../models')
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  patchUser: async (req, res, next) => {
    try {
      // find a user by primary key
      const user = await User.findByPk(req.params.user_id)
      await user.update({
        isAdmin: user.isAdmin ? 0 : 1
      })
      const users = await User.findAll({
        raw: true
      })
      res.render('admin/users', { users })
    } catch (error) {
      throw new Error('patchUser error')
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        raw: true
      })
      res.render('admin/users', { users })
    } catch (error) {
      throw new Error('getUsers error')
    }
  },
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.rest_id, { // find a restaurant by primary key
      raw: true // transform to plain object
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") // didnot find a restaurant
        else res.render('admin/restaurant', { restaurant }) // find a restaurant successfully
      })
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req // = const file = req.file
    imgurFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      })
      )
      .then(() => {
        req.flash('success_messages', 'restaurant was created successfully')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.rest_id, { // find a restaurant by primary key
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") // didnot find a restaurant
        else res.render('admin/edit-restaurant', { restaurant }) // find a restaurant successfully
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req // = const file = req.file
    Promise.all([ // 非同步處理
      Restaurant.findByPk(req.params.rest_id), // 去資料庫查有沒有這間餐廳
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
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
        req.flash('success_messages', 'restaurant was updated successfully')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.rest_id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        else return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }
}
module.exports = adminController
