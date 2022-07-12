const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      // if req.params.id exists, get the category data set with this id
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null,
      ])
      return res.render('admin/categories', { categories, category })
    } catch (error) {
      next(error)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required field!')

      await Category.create({ name })
      req.flash('success_messages', 'You have created a new category successfully!')
      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required field!')

      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error('This category does not exist! Please create it.')
      await category.update({ name })

      req.flash('success_messages', 'You have updated the category successfully!')
      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },
}

module.exports = categoryController
