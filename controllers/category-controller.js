const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      res.render('admin/categories', { categories })
    } catch (err) {
      next(err)
    }
  },
  postCategories: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required')
      await Category.create({ name })
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
