const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../middleware/file-helpers')
const { isSuperUser } = require('../middleware/auth-helpers')

const adminController = {
  // Restaurants CRUD
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },

  createRestaurant: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      return res.render('admin/create-restaurant', { categories })
    } catch (error) {
      next(error)
    }
  },

  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } =
      req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req

    imgurFileHandler(file)
      .then(filePath =>
        Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          categoryId,
          image: filePath || null
        })
      )
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  editRestaurant: async (req, res, next) => {
    try {
      const [restaurant, categories] = await Promise.all([
        Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] }),
        Category.findAll({ raw: true })
      ])

      if (!restaurant) throw new Error("Restaurant didn't exist!")
      return res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (error) {
      next(error)
    }
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } =
      req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req

    Promise.all([Restaurant.findByPk(req.params.id), imgurFileHandler(file)])
      // Keep sequelize class to update data
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant
          .update({
            name,
            tel,
            address,
            openingHours,
            description,
            categoryId,
            image: filePath || restaurant.image
          })
          .then(() => {
            req.flash(
              'success_messages',
              'restaurant was successfully to update'
            )
            return res.redirect('/admin/restaurants')
          })
          .catch(err => next(err))
      })
  },

  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => {
        return res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  // Users CRUD
  getUsers: async (req, res) => {
    const users = await User.findAll({ raw: true })
    return res.render('admin/users', {
      users,
      script: 'admin/users',
      user: req.user
    })
  },

  patchUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)

      // Validate user type
      if (!user) throw new Error("User doesn't exist")
      if (isSuperUser(user)) {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }

      // Update user access
      await user.update({ isAdmin: !user.isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (error) { next(error) }
  }
}

module.exports = adminController
