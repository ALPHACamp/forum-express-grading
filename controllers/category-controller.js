const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    // 確認有無category，沒有為null
    const { id } = req.params
    try {
      const [categories, category] = await Promise.all([Category.findAll({ raw: true }), id ? Category.findByPk(id, { raw: true }) : null])
      return res.render('admin/categories', { categories, category })
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    // 取出新增的名字
    const { name } = req.body
    try {
      if (!name) throw new Error('Category Name is required')
      // 用create
      await Category.create({ name })
      // redirect
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  putCategory: async (req, res, next) => {
    // 取得category
    const { name } = req.body
    const { id } = req.params
    if (!name) throw new Error('Category Name is required')
    try {
      // 找出對應的
      const category = await Category.findByPk(id)
      // 沒有就報錯
      if (!category) throw new Error('Category Name cannot find')
      // 有就更新
      await category.update({ name })
      // redirect
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  deleteCategory: async (req, res, next) => {
    // 取得category
    const { id } = req.params
    try {
      // 有就刪掉
      const category = await Category.findByPk(id)
      if (!category) throw new Error('Category Name cannot find')
      category.destroy()
      // redirect
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
