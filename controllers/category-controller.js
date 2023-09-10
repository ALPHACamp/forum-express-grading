const { Category } = require('../models')

module.exports = {
  async getCategories (req, res, next) {
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
  async postCategory (req, res, next) {
    try {
      const { name } = req.body

      if (!name || !name.replace(/\s/g, '').length) throw new Error('Category name is required')
      await Category.create({ name })
      req.flash('success_messages', 'A Category was successfully created')
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  async putCategory (req, res, next) {
    try {
      const { name } = req.body
      if (!name || !name.replace(/\s/g, '').length) throw new Error('Category name is required')

      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error('The category is not existed')
      await category.update({ name })
      req.flash('success_messages', 'The category was successfully to update')
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  async deleteCategory (req, res, next) {
    try {
      const category = await Category.findByPk(req.params.id)

      if (!category) throw new Error('The category is not existed')
      await category.destroy()
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}
