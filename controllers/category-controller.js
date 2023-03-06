const { Category } = require('../models')
const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const [categories, category] = await Promise.all([
        Category.findAll({
          raw: true
        }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
      ])
      res.render('admin/categories', { categories, category })
    } catch (err) {
      next(err)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category doesn't exist!")
      await category.update({ name })
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      const categories = await Category.findAll({ raw: true })
      categories.forEach(category => {
        if (category.name === name) {
          throw new Error('Category already exist!')
        }
      })
      await Category.create({ name })
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = categoryController
