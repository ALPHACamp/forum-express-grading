const { Category } = require('../models')
module.exports = {
  getCategories: async (req, res, next) => {
    const id = req.params.id
    try {
      const [categories, category] = await Promise.all([Category.findAll({ raw: true }),
        id ? Category.findByPk(id, { raw: true }) : null])
      res.render('admin/categories', { categories, category })
    } catch (error) {
      next(error)
    }
  },
  postCategories: async (req, res, next) => {
    try {
      const { name } = req.body
      console.log(name)
      if (!name) {
        req.flash('error_messges', 'Name can\'t be empty')
        return res.redirect('/admin/categories')
      }
      await Category.create({ name })
      req.flash('success_messages', `${name}新增成功`)
      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },
  putCategories: async (req, res, next) => {
    const { name } = req.body
    const { id } = req.params

    try {
      const category = await Category.findByPk(id)
      if (!category) throw new Error('該分類不存在')
      await category.update({ name })
      req.flash('success_messages', '修改成功')
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },
  deleteCategories: async (req, res, next) => {
    const { id } = req.params
    try {
      const category = await Category.findByPk(id)
      if (!category) throw new Error('該分類不存在')
      await category.destroy()
      req.flash('success_messages', '刪除成功')
      res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}
