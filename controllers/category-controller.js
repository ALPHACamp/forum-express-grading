const { Category } = require('../models')
const AdminCategoryError = require('../errors/errors')
const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(parseInt(req.params.id), { raw: true }) : null
      ])
      return res.render('admin/categories', { categories, category })
    } catch (error) {
      return next(error)
    }
  },
  // add category
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) {
        throw new AdminCategoryError('Category name is required')
      }
      await Category.create({ name })
      req.flash('success_messages', 'Category was successfully created')
      return res.redirect('/admin/categories')
    } catch (error) {
      return next(error)
    }
  },
  // edit category
  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) {
        throw new AdminCategoryError('Category name is required')
      }

      const category = await Category.findByPk(parseInt(req.params.id))
      if (!category) {
        throw new AdminCategoryError('Category was not existed')
      }
      await category.update({ name })

      req.flash('success_messages', 'Category was successfully edited')
      return res.redirect('/admin/categories')
    } catch (error) {
      return next(error)
    }
  },
  // delete category
  deleteCategory: async (req, res, next) => {
    try {
      const id = req.params.id
      const category = await Category.findByPk(id, {
        raw: false
      })
      if (!category) {
        throw new AdminCategoryError('Category didn\'t exist!')
      }

      await category.destroy()
      req.flash('success_messages', 'Category was successfully deleted')
      res.redirect('/admin/categories')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = categoryController
