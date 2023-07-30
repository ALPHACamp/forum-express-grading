const { Restaurant, User } = require('../models')
const { AdminError } = require('../errors/errors')
const { imgurFileHandler } = require('../helper/file-helper')
const adminHelper = require('../helper/admin-helper')
const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true
      })
      return res.render('admin/restaurants', { restaurants }) // admin前面不要加forward slash
    } catch (error) {
      return next(error)
    }
  },
  createRestaurants: (req, res, next) => {
    try {
      res.render('admin/create-restaurants')
    } catch (error) {
      return next(error)
    }
  },
  postRestaurant: async (req, res, next) => {
    try {
      // body是原來form文字傳入的東西
      // file則是從multer讀進來的東西，要丟到file-helper裡

      const { body, file } = req // 取出 req.body req.file
      const { name, tel, address, openingHours, description } = body
      // 把file放進helper裡面，回傳的值放進資料庫裡
      const filePath = await imgurFileHandler(file)

      if (!name) { throw new AdminError('Restaurant name is required!') }
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      })
      req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
      return res.redirect('/admin/restaurants')
    } catch (error) {
      return next(error)
    }
  },
  getRestaurant: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10)
      const restaurant = await Restaurant.findByPk(id, {
        raw: true // 去掉query的原始值
      })
      if (!restaurant) {
        throw new AdminError('Restaurant didn\'t exist!')
      }
      return res.render('admin/restaurant', { restaurant })
    } catch (error) {
      return next(error)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10)
      const restaurant = await Restaurant.findByPk(id, {
        raw: true // 去掉query的原始值
      })
      if (!restaurant) {
        throw new AdminError('Restaurant didn\'t exist!')
      }
      return res.render('admin/edit-restaurant', { restaurant })
    } catch (error) {
      return next(error)
    }
  },
  putRestaurant: async (req, res, next) => {
    try {
      // 找出restaurant
      const id = parseInt(req.params.id, 10)
      const restaurant = await Restaurant.findByPk(id, {
        raw: false// 使用Sequelize套件的原始值
      })
      // 沒有restaurant會報錯
      if (!restaurant) {
        throw new AdminError('Restaurant didn\'t exist!')
      }

      // file是使用multer 取出圖片檔
      const { body, file } = req
      // 沒有提供名稱也會抱錯
      const { name, tel, address, openingHours, description } = body
      const filePath = await imgurFileHandler(file)
      if (!name) { throw new AdminError('Restaurant name is required!') }

      restaurant.set({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
      })
      await restaurant.save()
      req.flash('success_messages', 'restaurant was successfully to update')
      return res.redirect('/admin/restaurants')
    } catch (error) {
      return next(error)
    }
  },
  deleteRestaurant: async (req, res, next) => {
    try {
    // 找出restaurant
      const id = parseInt(req.params.id, 10)
      const restaurant = await Restaurant.findByPk(id, {
        raw: false// 使用Sequelize套件的原始值
      })
      // 沒有restaurant會報錯
      if (!restaurant) {
        throw new AdminError('Restaurant didn\'t exist!')
      }

      await restaurant.destroy()
      req.flash('success_messages', 'restaurant was successfully deleted')
      res.redirect('/admin/restaurants')
    } catch (error) {
      return next(error)
    }
  },
  // R01 HW
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users }) // admin前面不要加forward slash
    } catch (error) {
      return next(error)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10)
      const targetUser = await User.findByPk(id)
      const rootBeenRemove = adminHelper.isRootAdminBeenRemove(targetUser, 'root@example.com')
      if (rootBeenRemove) {
        req.flash('error_messages', '禁止變更 root 權限') // 不能用throw error的方式，測試黨會抓不到req.flash
        return res.redirect('back')
      }
      // 不要用set + save, 測試黨抓不到
      await targetUser.update({
        isAdmin: !targetUser.isAdmin
      })
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
