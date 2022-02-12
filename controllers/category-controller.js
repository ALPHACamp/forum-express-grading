const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const category = req.params.id ? await Category.findByPk(req.params.id, { raw: true }) : null
      const categories = await Category.findAll({ raw: true })
      return res.render('admin/categories', { categories, category })
    } catch (error) {
      next(error)
    }
  },
  postCategory: async (req, res, next) => {
    const { name } = req.body
    console.log(req.body)
    try {
      if (!name) throw new Error('Category name is required!')
      await Category.create({ name })
      req.flash('success_messages', 'category was successfully created')
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },
  putCategory: async (req, res, next) => {
    const { name } = req.body
    try {
      if (!name) throw new Error('Category name is required!')
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category didn't exist!")
      await category.update({ name })
      req.flash('success_messages', 'category was successfully to update')
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category didn't exist!")
      await category.destroy()
      req.flash('success_messages', 'category was successfully to delete')
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController
