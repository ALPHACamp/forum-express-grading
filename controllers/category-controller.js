const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        Category.findByPk(req.params.id, { raw: true })
      ])
      res.render('admin/categories', { categories, category })
    } catch (err) {
      next(err)
    }
  },
  postCategories: async (req, res, next) => {
    try {
      const name = req.body.name
      if (!name) throw new Error('Category name is required!')
      await Category.create({ name })
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  putCategories: async (req, res, next) => {
    try {
      const name = req.body.name
      if (!name) throw new Error('Category name is required!')
      const category = await Category.findByPk(req.params.id)
      await category.update({ name })
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
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
