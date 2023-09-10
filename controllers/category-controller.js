const { Category } = require('../models')

module.exports = {
  async getCategories (_req, res, next) {
    try {
      res.render('admin/categories', {
        categories: await Category.findAll({ raw: true })
      })
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
  }
}
