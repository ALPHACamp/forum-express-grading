// - 處理屬於restaurant路由的相關請求
const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true, // -將關聯資料包裝成物件
        include: [Category] // -取得關聯資料
      })
      return res.render('admin/restaurants', { restaurants })
    } catch (error) {
      return next(error)
    }
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    const { file } = req // - 取圖片檔
    try {
      if (!name) throw new Error('Restaurant name is required!')
      const filePath = await imgurFileHandler(file)
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      })
      req.flash('success_messages', '成功建立新餐廳!')
      return res.redirect('/admin/restaurants')
    } catch (error) {
      return next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, {
        raw: true,
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error('此餐廳不存在!')
      return res.render('admin/restaurant', { restaurant })
    } catch (error) {
      return next(error)
    }
  },
  editRestaurant: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id, { raw: true })
      if (!restaurant) throw new Error('此餐廳不存在!')
      return res.render('admin/edit-restaurant', { restaurant })
    } catch (error) {
      return next(error)
    }
  },
  putRestaurant: async (req, res, next) => {
    const { id } = req.params
    const { name, tel, address, openingHours, description } = req.body
    const { file } = req
    try {
      if (!name) throw new Error('Restaurant name is required!')
      const [restaurant, filePath] = await Promise.all([
        Restaurant.findByPk(id),
        imgurFileHandler(file)
      ])
      if (!restaurant) throw new Error('此餐廳不存在!')
      // - 利用回傳的instance再次使用sequelize提供的方法
      await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        // - 如果為Truthy(user有上傳新圖片)使用filePath
        // - 否則就用原先DB的image
        image: filePath || restaurant.image
      })
      req.flash('success_messages', '成功更新餐廳資料!')
      return res.redirect('/admin/restaurants')
    } catch (error) {
      return next(error)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    const { id } = req.params
    try {
      const restaurant = await Restaurant.findByPk(id)
      if (!restaurant) return new Error('此餐廳不存在!')
      await restaurant.destroy()
      return res.redirect('/admin/restaurants')
    } catch (error) {
      return next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users })
    } catch (error) {
      return next(error)
    }
  },
  patchUser: async (req, res, next) => {
    const { id } = req.params
    try {
      const foundUser = await User.findByPk(id)
      if (!foundUser) return new Error('此用戶不存在')
      if (foundUser.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      // -切換一般管理員與使用者權限
      await foundUser.update({
        isAdmin: !foundUser.isAdmin
      })
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
