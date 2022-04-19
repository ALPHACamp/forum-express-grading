const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const { id } = req.params
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        id ? Category.findByPk(id, { raw: true }) : null
      ])
      return res.render('admin/categories', { categories, category })
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('名字欄位不可為空！')

      const existedName = await Category.findOne({ where: { name } })
      if (existedName) throw new Error('不可新增已存在的名稱！')

      await Category.create({ name })
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name } = req.body

      const category = await Category.findByPk(id)
      if (!category) throw new Error('該分類不存在！')

      await category.update({ name })
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
