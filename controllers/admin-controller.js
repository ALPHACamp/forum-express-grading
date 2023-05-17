const { Restaurant, User, Category } = require('../models')
const { imgurFieldHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: async (req, res, next) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      return res.render('admin/restaurants', { restaurants })
    } catch (err) {
      next(err)
    }
  },
  createRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      return res.render('admin/create-restaurant', { categories })
    } catch (err) {
      next(err)
    }
  },
  postRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
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
        image: filePath || null, // 沒有照片就回傳null
        categoryId
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
        nest: true,
        include: [Category]
      })
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  editRestaurant: async (req, res, next) => {
    try {
      const [restaurant, categories] = await Promise.all([
        Restaurant.findByPk(req.params.id, {
          raw: true,
          nest: true
        }),
        Category.findAll({ raw: true })
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (err) {
      next(err)
    }
  },
  putRestaurant: async (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    const { file } = req
    try {
      if (!name) throw new Error('Restaurant name is required!')
      const [restaurant, filePath] = await Promise.all([Restaurant.findByPk(req.params.id), imgurFieldHandler(file)])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      await restaurant.update({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || restaurant.image,
        categoryId
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
  },
  getUsers: async (req, res, next) => {
    try {
      // 找出所有user
      const users = await User.findAll({ raw: true, nest: true })
      // 根據isAdmin定義role(目前角色)跟setAs(另一個角色)
      users.forEach(user => {
        if (user.isAdmin === 1) {
          user.role = 'admin'
          user.setAs = 'set as user'
        } else {
          user.role = 'user'
          user.setAs = 'set as admin'
        }
      })
      // user頁面
      res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },
  patchUser: async (req, res, next) => {
    // 找出id
    const id = req.params.id
    try {
      // 根據id找出對應user
      const user = await User.findByPk(id)
      // 沒有找到回傳錯誤訊息
      if (!user) throw new Error("User didn't exist!")
      // 判斷user email是否為root@example.com，是的話禁止修改
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        // 回傳至上一頁
        return res.redirect('back')
      }
      // 切換isAdmin
      await user.update({ isAdmin: !user.isAdmin })
      // 修改成功訊息
      req.flash('success_messages', '使用者權限變更成功')
      // redirect到getUser
      return res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
