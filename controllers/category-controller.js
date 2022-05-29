const { Category } = require('../models')
const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categoryId = req.params.id
      const categories = await Category.findAll({ raw: true })
      const category = categoryId ? await Category.findByPk(categoryId, { raw: true }) : null
      return res.render('admin/categories', { categories, category })
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
  },
  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      const categoryId = req.params.id
      if (!name) throw new Error('Category name is required!')
      const category = await Category.findByPk(categoryId)
      if (!category) throw new Error("Category didn't exist!")
      await category.update({ name })
      req.flash('success_messages', 'Category was successfully updated')
      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const categoryId = req.params.id
      const category = await Category.findByPk(categoryId)
      if (!category) throw new Error("Category didn't exist!")
      await category.destroy()
      req.flash('success_messages', 'Category was successfully deleted')
      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}
module.exports = categoryController
