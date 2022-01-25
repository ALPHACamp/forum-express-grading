const { Restaurant, Category } = require('../models')
const { isAttached } = require('../middleware/data-helper')

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
      // Find if any restaurant is attached to this category
      const a = await isAttached(req.params.id, Restaurant, 'categoryId')
      console.log(a)
      // If so, ask admin to decide how to keep it or delete it

      // await Category.destroy({ where: { id: req.params.id } })
      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController
