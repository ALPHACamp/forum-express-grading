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
      const compareCategory = await Category.findAll({ where: { name }, raw: true })
      console.log('000000000000000')
      console.log(compareCategory)
      if (compareCategory.id !== req.params.id) { throw new Error('Category already exist!') }
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
      if (categories.filter(category => category.name === name).length > 0) {
        throw new Error('Category already exist!')
      }
      await Category.create({ name })
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  deleteCategory: async (req, res, next) => {
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
