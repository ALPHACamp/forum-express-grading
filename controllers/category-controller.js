const { Category, Restaurant } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
      })
      .catch(err => next(err))
  },
  postCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  putCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        if (category.name === '尚未分類') {
          req.flash('error_messages', '禁止修改[尚未分類]')
          return res.redirect('back')
        }
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully to update')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategories: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category didn't exist!")
      if (category.name === '尚未分類') {
        req.flash('error_messages', '禁止刪除[尚未分類]')
        return res.redirect('back')
      }
      const uncategorized = await Category.findOne({ where: { name: '尚未分類' } })
      const uncategorizedId = uncategorized.id
      const categoryId = category.id
      await Restaurant.update({ categoryId: uncategorizedId }, { where: { categoryId } })
      await category.destroy()
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
