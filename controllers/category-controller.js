const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const promiseData = await Promise.all([
        Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
      ])
      const categories = promiseData[0]
      const category = promiseData[1]

      return res.render('admin/categories', { categories, category })
    } catch (error) {
      return next(error)
    }
  },

  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body

      if (!name) throw new Error('Category name is required!')

      await Category.create({ name })
      return res.redirect('/admin/categories')
    } catch (error) {
      return next(error)
    }
  },

  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body

      if (!name) throw new Error('Category name is required!')

      const category = await Category.findByPk(req.params.id)
      await category.update({ name })

      return res.redirect('/admin/categories')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = categoryController
