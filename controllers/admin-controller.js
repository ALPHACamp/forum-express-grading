const { Restaurant, User, Category } = require('../models')

const { localFileHandler, imgurFileHandler } = require('../helpers/file-helpers.js')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      res.render('admin/restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  },

  createRestaurant: (req, res, next) => {
    res.render('admin/create-restaurant')
  },

  postRestaurant: async (req, res, next) => {
    try {
      if (!req.body.name) throw new Error('Restaurant name is required!')
      const { file } = req
      // const filePath = await localFileHandler(file)
      const filePath = await imgurFileHandler(file)
      await Restaurant.create(Object.assign({ image: filePath || null }, req.body))
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { raw: true, nest: true, include: [Category] })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },

  getEditRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, { raw: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/edit-restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },

  putEditRestaurant: async (req, res, next) => {
    try {
      if (!req.body.name) throw new Error('Restaurant name is required!')
      const id = req.params.id
      const { file } = req
      // const filePath = await localFileHandler(file)
      const filePath = await imgurFileHandler(file)
      const restaurant = await Restaurant.findByPk(id)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.update(Object.assign({ image: filePath || restaurant.image }, req.body))
      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },

  deleteRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true, nest: true })
      res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },

  patchUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exist!")
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      const isAdmin = !user.isAdmin  // user.isAdmin ? false : true || user.isAdmin === false
      await user.update({ isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController