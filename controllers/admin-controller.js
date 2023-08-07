const { Restaurant, User, Category } = require('../models')
const { AdminError } = require('../errors/errors')
const { imgurFileHandler } = require('../helpers/file-helper')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const adminHelper = require('../helpers/admin-helper')
const MAX_DESCRIPTION_LENGTH = 500

const adminController = {
  getRestaurants: async (req, res, next) => {
    const DEFAULT_LIMIT = 10
    const DEFAULT_FIRST_PAGE = 1
    try {
      const page = parseInt(req.query.page) || DEFAULT_FIRST_PAGE
      const limit = parseInt(req.query.limit) || DEFAULT_LIMIT // 預留以後可以自己設定一頁要呈現多少餐廳
      const offset = getOffset(limit, page)
      const restaurants = await Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        limit,
        offset,
        include: [Category] // 一起帶入Category的東西
      })
      /* 不加nest會長這樣
        Restaurant{
          'Category.id': 43,
          'Category.name': '中式料理',
          'Category.createdAt': 2023-07-31T09:03:17.000Z,
          'Category.updatedAt': 2023-07-31T09:03:17.000Z
        }

      */
      return res.render('admin/restaurants', {
        route: req.path, // get which route i'm in
        restaurants: restaurants.rows,
        pagination: getPagination(limit, page, restaurants.count)
      }) // admin前面不要加forward slash
    } catch (error) {
      return next(error)
    }
  },
  createRestaurants: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      res.render('admin/create-restaurants', { categories })
    } catch (error) {
      return next(error)
    }
  },
  postRestaurant: async (req, res, next) => {
    try {
      // body是原來form文字傳入的東西
      // file則是從multer讀進來的東西，要丟到file-helper裡

      const { body, file } = req // 取出 req.body req.file
      const { name, tel, address, openingHours, description, categoryId } = body
      // 把file放進helper裡面，回傳的值放進資料庫裡
      const filePath = await imgurFileHandler(file)

      if (!name) { throw new AdminError('Restaurant name is required!') }

      // 防止description太長 造成Payload Too Large error
      if (description && description.length > MAX_DESCRIPTION_LENGTH) { throw new AdminError('Description is too long!') }
      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
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
        include: [Category]
      })
      if (!restaurant) {
        throw new AdminError('Restaurant didn\'t exist!')
      }
      // 使用toJSON取出檔案不會改變restaurant原本sequelize屬性，之後可以做別種操作
      return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
    } catch (error) {
      return next(error)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10)
      const [restaurant, categories] = await Promise.all([
        Restaurant.findByPk(id, {
          raw: true // 去掉query的原始值
        }),
        Category.findAll({ raw: true }) // 取得所有category給表單渲染
      ])
      if (!restaurant) {
        throw new AdminError('Restaurant didn\'t exist!')
      }
      return res.render('admin/edit-restaurant', { restaurant, categories })
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
      const { name, tel, address, openingHours, description, categoryId } = body

      // 防止description太長 造成Payload Too Large error
      if (description && description.length > MAX_DESCRIPTION_LENGTH) { throw new AdminError('Description is too long!') }

      const filePath = await imgurFileHandler(file)
      if (!name) { throw new AdminError('Restaurant name is required!') }

      restaurant.set({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image, // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        categoryId
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
