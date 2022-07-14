const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) =>
        res.render('admin/categories', { categories, category }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body

    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Create category successfully!')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Update category successfully!')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error('Category does not exit!')
        return Category.destroy({ where: { id: req.params.id } })
      })
      .then(() => {
        req.flash('success_messages', 'Delete category successfully!')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
