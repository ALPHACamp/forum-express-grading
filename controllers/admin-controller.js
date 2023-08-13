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
    } catch (error) {
      return next(error)
    }
  },

  createRestaurant: async (req, res, next) => {
    try {
      const categories = Category.findAll({
        raw: true
      })
      return res.render('admin/create-restaurant', { categories })
    } catch (error) {
      return next(error)
    }
  },

  postRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name) throw new Error('Restaurant name is required!')

      const { file } = req
      const [filePath] = await Promise.all([imgurFileHandler(file)])

      await Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      })

      req.flash('success_messages', 'restaurant was successfully created')
      return res.redirect('/admin/restaurants')
    } catch (error) {
      return next(error)
    }
  },

  getRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(
        req.params.id,
        {
          raw: true,
          nest: true,
          include: [Category]
        })
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      return res.render('admin/restaurant', { restaurant })
    } catch (error) {
      return next(error)
    }
  },

  editRestaurant: async (req, res, next) => {
    try {
      const [restaurant, categories] = await Promise.all([
        Restaurant.findByPk(req.params.id, { raw: true }),
        Category.findAll({ raw: true })
      ])

      if (!restaurant) throw new Error("Restaurant didn't exist!")

      return res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (error) {
      return next(error)
    }
  },

  putRestaurant: async (req, res, next) => {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body
      if (!name) throw new Error('Restaurant name is required!')

      const { file } = req

      const [restaurant, filePath] = await Promise.all([
        Restaurant.findByPk(req.params.id),
        imgurFileHandler(file)
      ])

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

      req.flash('success_messages', 'restaurant was successfully to update')
      return res.redirect('/admin/restaurants')
    } catch (error) {
      return next(error)
    }
  },

  deleteRestaurant: async (req, res, next) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      await restaurant.destroy()
      return res.redirect('/admin/restaurants')
    } catch (error) {
      return next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({ raw: true, nest: true })
      return res.render('admin/users', { users })
    } catch (error) {
      return next(error)
    }
  },

  patchUser: async (req, res, next) => {
    try {
      const { id } = req.params

      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exist!")
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }

      await user.update({ isAdmin: !user.isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = adminController
