const { Category } = require('../models')

module.exports = {
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
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category created.')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const id = req.params.id
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('Category does not exist!')
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Edit category successfully.')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    const id = req.params.id
    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('Category does not exists.')
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}
