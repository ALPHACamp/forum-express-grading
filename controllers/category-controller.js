const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
      ])

      res.render('admin/categories', { categories, category })
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')

      await Category.create({ name })

      req.flash('success_messages', 'Category was successfully created.')
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  putCategories: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')

      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category doesn't exist!")

      await category.update({ name })

      req.flash('success_messages', 'Category name was successfully to update.')
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  deleteCategories: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category didn't exist!")

      await category.destroy()
      req.flash('success_messages', 'Category was successfully to delete.')
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
