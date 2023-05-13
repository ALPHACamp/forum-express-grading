const { Restaurant } = require('../models')
const { imgurFieldHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true })
      return res.render('admin/restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    const { file } = req
    try {
      if (!name) throw new Error('Restaurant name is required!')
      const filePath = await imgurFieldHandler(file)
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null // 沒有照片就回傳null
      })
      req.flash('success_messages', 'restaurant was successfully created')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/edit-restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  putRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    const { file } = req
    try {
      if (!name) throw new Error('Restaurant name is required!')
      const [restaurant, filePath] = await Promise.all([
        Restaurant.findByPk(req.params.id),
        imgurFieldHandler(file)
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image
      })
      req.flash('success_messages', '成功修改!')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
