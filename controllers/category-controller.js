const { Category } = require('../models')
const categoryController = {
  // 瀏覽全分類
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      return res.render('admin/categories', { categories })
    } catch (e) {
      next(e)
    }
  },
  // 新增一項分類
  postCategory: async (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    try {
      const createCategory = await Category.create({ name })
      if (createCategory) return res.redirect('/admin/categories')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = categoryController
