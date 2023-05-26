const { Category } = require('../models')

const categoryController = {
  // 瀏覽全分類
  getCategories: async (req, res, next) => {
    const { id } = req.params
    try {
      if (id) {
        const category = await Category.findByPk(id, { raw: true })
        return res.render('admin/categories', { category })
      } else {
        const categories = await Category.findAll({ raw: true })
        return res.render('admin/categories', { categories })
      }
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
  },
  // 修改一項分類
  putCategory: async (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    try {
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category doesn't exist!")
      const renewCategory = await category.update({ name })
      if (renewCategory) return res.redirect('/admin/categories')
    } catch (e) {
      next(e)
    }
  },
  // 刪除一項分類
  deleteCategory: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category didn't exist!")
      const deleteOne = await category.destroy()
      if (deleteOne) res.redirect('/admin/categories')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = categoryController
