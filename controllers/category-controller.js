const { Category } = require('../models')

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
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('類別名稱不可為空')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', '新增分類成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('類別名稱不可為空')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error('找不到此類別')
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', '修改分類成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
