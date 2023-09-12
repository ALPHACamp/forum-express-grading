const { Restaurant, User, Category } = require('../models')
const { localFileHandler } = require('../helpers/file-helper')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

module.exports = {
  async getRestaurants (req, res, next) {
    try {
      const DEFAULT_LIMIT = 7
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const restaurants = await Restaurant.findAndCountAll({
        raw: true,
        limit,
        offset,
        include: [Category],
        nest: true
      })

      res.render('admin/restaurants', {
        restaurants: restaurants.rows,
        pagination: getPagination(limit, page, restaurants.count)
      })
    } catch (err) {
      next(err)
    }
  },
  async createRestaurant (_req, res) {
    res.render('admin/create-restaurant', { categories: await Category.findAll({ raw: true }) })
  },
  async postRestaurant (req, res, next) {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body

      if (!name || !name.replace(/\s/g, '').length) throw new Error('Restaurant name is required')

      const filePath = await localFileHandler(req.file)
      await Restaurant.create({ name, tel, address, openingHours, description, image: filePath || null, categoryId })
      req.flash('success_messages', 'A restaurant was successfully created')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  async getRestaurant (req, res, next) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        raw: true,
        include: [Category],
        nest: true
      })

      if (!restaurant) throw new Error('The restaurant is not existed.')
      res.render('admin/restaurant', { restaurant })
    } catch (err) {
      next(err)
    }
  },
  async editRestaurant (req, res, next) {
    try {
      const [restaurant, categories] = await Promise.all([
        Restaurant.findByPk(req.params.id, { raw: true }),
        Category.findAll({ raw: true })
      ])

      if (!restaurant) throw new Error('The restaurant is not existed.')
      res.render('admin/edit-restaurant', { restaurant, categories })
    } catch (err) {
      next(err)
    }
  },
  async putRestaurant (req, res, next) {
    try {
      const { name, tel, address, openingHours, description, categoryId } = req.body

      if (!name || !name.replace(/\s/g, '').length) throw new Error('Restaurant name is required')

      const [restaurant, filePath] = await Promise.all([
        Restaurant.findByPk(req.params.id),
        localFileHandler(req.file)
      ])

      if (!restaurant) throw new Error('The restaurant is not existed')
      await restaurant.update({ name, tel, address, openingHours, description, image: filePath || restaurant.image, categoryId })
      req.flash('success_messages', 'The restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  async deleteRestaurant (req, res, next) {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)

      if (!restaurant) throw new Error('The restaurant is not existed')
      await restaurant.destroy()
      res.redirect('/admin/restaurants')
    } catch (err) {
      next(err)
    }
  },
  async getUsers (_req, res, next) {
    try {
      const users = await User.findAll({ raw: true })

      res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },
  async patchUser (req, res, next) {
    try {
      const userId = req.params.id
      if (!userId) throw new Error('User id is required')

      const user = await User.findByPk(userId)
      if (!user) throw new Error('The user is not existed')
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        res.redirect('back')
      } else {
        await user.update({ isAdmin: !user.isAdmin })
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      }
    } catch (err) {
      next(err)
    }
  }
}
