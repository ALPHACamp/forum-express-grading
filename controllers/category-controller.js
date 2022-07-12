const { Category } = require('../models')

module.exports = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      res.render('admin/categories', { categories })
    } catch (err) { next(err) }
  }
}
