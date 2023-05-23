const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  // 管理者登入餐廳首頁
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true, // 資料清洗：將sequelize物件轉為JS原生物件
        nest: true, // 資料清洗：將取出的物件打包便於取用
        include: Category // 取得關聯資料
      })
      if (restaurants) res.render('admin/restaurants', { restaurants })
    } catch (e) {
      next(e)
    }
  },
  // 管理者新增頁面
  createRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      return res.render('admin/create-restaurant', { categories })
    } catch (e) {
      next(e)
    }
  },
  // 管理者新增功能
  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name) throw new Error('Restaurant name is required.')

      const { file } = req
      const filePath = await imgurFileHandler(file)
      const newRestaurant = await Restaurant.create({ name, tel, address, openingHours, description, image: filePath || null, categoryId })
      if (newRestaurant) {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      }
    } catch (e) {
      next(e)
    }
  },
  // 管理者瀏覽單筆餐廳資料
  getRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id, {
        raw: true, // 只有單筆資料時這段可省略，
        nest: true, // 渲染時用 { restaurant: restaurant.toJSON() } 效果相同
        include: [Category]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist.")
      res.render('admin/restaurant', { restaurant })
    } catch (e) {
      next(e)
    }
  },
  // 管理者修改頁面
  editRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const categories = await Category.findAll({ raw: true })
      const restaurant = await Restaurant.findByPk(id, { raw: true })
      if (!restaurant) throw new Error("Restaurant didn't exist.")
      res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (e) {
      next(e)
    }
  },
  // 管理者修改單筆資料
  putRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name) throw new Error('Restaurant name is required.')
      const { file } = req
      const { id } = req.params
      const restaurant = await Restaurant.findByPk(id)
      if (!restaurant) throw new Error("Restaurant didn't exist.")
      const filePath = await imgurFileHandler(file)
      const renewRestaurant = await restaurant.update({ name, tel, address, openingHours, description, image: filePath || restaurant.image, categoryId })
      if (renewRestaurant) {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      }
    } catch (e) {
      next(e)
    }
  },
  // 管理員刪除資料
  deleteRestaurant: async (req, res, next) => {
    try {
      const id = req.params.id
      const restaurant = await Restaurant.findByPk(id)
      if (!restaurant) throw new Error("Restaurant didn't exist.")
      const deleteRestaurant = await restaurant.destroy()
      if (deleteRestaurant) res.redirect('/admin/restaurants')
    } catch (e) {
      next(e)
    }
  },
  // 管理者切換使用者頁面
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true, nest: true })
      if (users) res.render('admin/users', { users })
    } catch (e) {
      next(e)
    }
  },
  // 管理者變更使用者權限
  patchUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const findUser = await User.findByPk(id)
      // 若找不到使用者
      if (!findUser) throw new Error("User didn't exist.")
      // 若變更對象為root
      if (findUser.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }
      await findUser.update({ isAdmin: !findUser.isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      res.redirect('/admin/users')
    } catch (e) {
      next(e)
    }
  }
}
module.exports = adminController
