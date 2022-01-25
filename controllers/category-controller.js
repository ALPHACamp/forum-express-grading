const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const [category, categories] = await Promise.all([
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null,
        Category.findAll({ raw: true })
      ])
      return res.render('admin/categories', { category, categories })
    } catch (error) {
      next(error)
    }
  },

  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Please enter category name!')
      await Category.findOrCreate({ where: { name } })

      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },

  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Please enter category name!')
      await Category.update({ name }, { where: { id: req.params.id } })

      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      await Category.destroy({ where: { id: req.params.id } })
      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController
