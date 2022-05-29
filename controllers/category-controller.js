const { Category } = require('../models')
const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      return res.render('admin/categories', { categories })
    } catch (error) {
      next(error)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      await Category.create({ name })
      req.flash('success_messages', 'Category was successfully created')
      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}
module.exports = categoryController
