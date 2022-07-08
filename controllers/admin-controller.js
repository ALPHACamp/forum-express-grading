// FilePath: controllers/admin-controllers.js
// Include modules
const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const fileHandler = imgurFileHandler

// Controller
const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      res.render('admin/users', { users })
    } catch (err) { next(err) }
  },
  patchUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId)
      if (!user) throw new Error('User not exists!')
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      await user.update({ isAdmin: !user.isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (err) { next(err) }
  },
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      res.render('admin/restaurants', { restaurants })
    } catch (err) { next(err) }
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: async (req, res, next) => {
    try {
      // Check if required info got null
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required!')

      // Create new restaurant
      const { file } = req // Get image file
      const filePath = await fileHandler(file)
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (err) { next(err) }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error('Restaurant did not exist!')
      res.render('admin/restaurant', { restaurant })
    } catch (err) { next(err) }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      if (!restaurant) throw new Error('Restaurant did not exist!')
      res.render('admin/edit-restaurant', { restaurant })
    } catch (err) { next(err) }
  },
  putRestaurant: async (req, res, next) => {
    try {
      // Check if required info got null
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('Restaurant name is required!')

      // Update restaurant info
      const { file } = req
      const filePath = await fileHandler(file)
      const restaurant = await Restaurant.findByPk(req.params.id)

      if (!restaurant) throw new Error('Restaurant did not exist!')
      restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image
      })
      req.flash('success_messages', 'Restaurant was successfully updated')
      res.redirect('/admin/restaurants')
    } catch (err) { next(err) }
  },
  deleteRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error('Restaurant did not exist!')
      await restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (err) { next(err) }
  }
}

module.exports = adminController
