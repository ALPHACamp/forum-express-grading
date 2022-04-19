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
    try {
      const { name } = req.body
      if (!name) throw new Error('名字欄位不可為空。')

      const existedName = await Category.findOne({ where: { name } })
      if (existedName) throw new Error('不可新增已存在的名稱。')

      await Category.create({ name })
      return res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
