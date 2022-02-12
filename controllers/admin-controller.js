const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { admin } = require('../config/config.json')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      return res.render('admin/restaurants', { restaurants })
    } catch (error) {
      next(error)
    }
  },
  createRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      res.render('admin/create-restaurant', { categories })
    } catch (error) {
      next(error)
    }
  },
  postRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    try {
      if (!name) throw new Error('Restaurant name is required!')
      const { file } = req
      const filePath = await imgurFileHandler(file)
      await Restaurant.create({ name, tel, address, openingHours, description, Image: filePath || null, categoryId })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/restaurant', { restaurant })
    } catch (error) {
      next(error)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      const categories = await Category.findAll({ raw: true })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (error) {
      next(error)
    }
  },
  putRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    try {
      if (!name) throw new Error('Restaurant name is required!')
      const { file } = req
      const restaurant = await Restaurant.findByPk(req.params.id)
      const filePath = await imgurFileHandler(file)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.update({ name, tel, address, openingHours, description, image: filePath || restaurant.filePath, categoryId })
      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.destroy()
      req.flash('success_messages', 'restaurant was successfully to delete')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users })
    } catch (error) {
      next(error)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new Error("User didn't exist!")
      if (user.email === admin) {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      const isAdmin = (req.body?.isAdmin === 'true') || !user.isAdmin
      await user.update({ isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      res.redirect('/admin/users')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
