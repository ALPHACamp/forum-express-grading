const { Category } = require('../models')
const assert = require('assert')

const categoryController = {
  getCategories: (req, res, next) => {
    const { id } = req.params
    Promise.all([
      Category.findAll({ raw: true }),
      id ? Category.findByPk(id, { raw: true }) : null
    ])
      .then(([categories, category]) =>
        res.render('admin/categories', { categories, category }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    assert(name, 'Category name is required!')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    assert(name, 'Category name is required!')
    return Category.findByPk(id)
      .then(category => {
        assert(category, "Category doesn't exist!")
        category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
