const { Category } = require('../models')
const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      return res.render('admin/categories', { categories })
    } catch (error) {
      next(error)
    }
  }
}
module.exports = categoryController
