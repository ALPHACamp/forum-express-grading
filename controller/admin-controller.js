
const { Restaurant } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true })
      return res.render('admin/restaurants', { restaurants })
    } catch (error) {
      console.log(error)
    }
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: async (req, res, next) => {
    // 取出表單中的資料
    const { name, tel, address, openingHours, description } = req.body
    try {
      // 檢查必填欄位
      if (!name) throw new Error('Restaurant name is required!')
      // 將multer 處理完的檔案交給file-helper，再回傳檔案所在的字串
      const filePath = await imgurFileHandler(req.file)
      await Restaurant.create({ name, tel, address, openingHours, description, image: filePath | null })
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (error) {
      console.log('in admin-controller.js Line:26', error)
      next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, {
        raw: true
      })
      if (!restaurant) throw new Error("Can't find restaurant , please search agian")
      res.render('admin/restaurant', { restaurant })
    } catch (error) {
      console.log('in admin-controller.js Line:40', error)
      next(error)
    }
  },
  editRestaurant: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id)
      res.render('admin/edit-restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  putRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    const { id } = req.params
    const { file } = req
    console.log('here is admin-controller line:59', file)
    try {
      if (!name) throw new Error('Restaurant name is required!')
      const restaurant = await Restaurant.findByPk(id)
      if (!restaurant) throw new Error("Can't find restaurant , please search agian")
      const filePath = await imgurFileHandler(file)
      await restaurant.update({ name, tel, address, openingHours, description, image: filePath || null })
      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id)
      if (!restaurant) throw new Error("Can't find restaurant , please search agian")
      await restaurant.destroy()
      req.flash('success_messages', 'Restaurant was successfuly to delete.')
      res.redirect('/admin/restaurants')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
