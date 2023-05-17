const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      return res.render('admin/categories', { categories })
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    // 取出新增的名字
    const { name } = req.body
    if (!name) throw new Error('Category Name is required')
    try {
      // 用create
      await Category.create({ name })
      // redirect
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
