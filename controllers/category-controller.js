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
  }
}
