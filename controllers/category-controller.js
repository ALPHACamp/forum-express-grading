const { Category } = require('../models')
const categoryController = {
  getCategories: async (req, res, next) => {
    const { id } = req.params
    try {
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        Category.findByPk(id, { raw: true })
      ])
      return res.render('admin/categories', {
        categories,
        category,
        id
      })
    } catch (error) {
      return next(error)
    }
  },
  postCategory: async (req, res, next) => {
    const { name } = req.body
    try {
      if (!name) throw new Error('名稱為必填!')
      await Category.create({ name })
      req.flash('success_messages', '新增類別成功!')
      return res.redirect('/admin/categories')
    } catch (error) {
      return next(error)
    }
  },
  putCategory: async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    try {
      if (!name) throw new Error('名稱為必填!')
      const category = await Category.findByPk(id)
      if (!category) throw new Error('類別不存在!')
      await category.update({ name })
      req.flash('success_messages', '更新類別成功!')
      return res.redirect('/admin/categories')
    } catch (error) {
      return next(error)
    }
  },
  deleteCategory: async (req, res, next) => {
    const { id } = req.params
    try {
      const category = await Category.findByPk(id)
      if (!category) throw new Error('類別不存在!')
      await category.destroy()
      req.flash('success_messages', '刪除類別成功!')
      return res.redirect('/admin/categories')
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = categoryController
