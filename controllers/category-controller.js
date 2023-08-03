const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      res.render('admin/categories', { categories })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
