const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })

      return res.render('admin/restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  },
  createRestaurant: async (req, res, next) => {
    try {
      return res.render('admin/create-restaurant')
    } catch (err) {
      next(err)
    }
  },
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description } = req.body
      if (!name) throw new Error('名字為必填欄位！')

      const { file } = req
      const filePath = await imgurFileHandler(file)

      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      })

      req.flash('success_messages', '該餐廳已被成功創建。')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, { 
        raw: true,
        nest: true,
        include: [Category]
      })

      if (!restaurant) throw new Error('該餐廳不存在。')

      return res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id, { raw: true })

      if (!restaurant) throw new Error('該餐廳不存在。')

      return res.render('admin/edit-restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  putRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const { file } = req
      const { name, tel, address, openingHours, description } = req.body

      if (!name) throw new Error('名字為必填欄位！')

      const [restaurant, filePath] = await Promise.all([
        Restaurant.findByPk(id),
        imgurFileHandler(file)
      ])

      if (!restaurant) throw new Error('該餐廳不存在！')

      await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image
      })

      req.flash('success_messages', '該餐廳已被成功修改。')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    try {
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id)

      if (!restaurant) throw new Error('該餐廳不存在。')

      await restaurant.destroy()

      req.flash('success_messages', '該餐廳已被成功被刪除。')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id)
      if (!user) throw new Error('該使用者不存在。')

      if (user.email === process.env.ROOT_ADMIN) {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }

      await user.update({ isAdmin: !user.isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
