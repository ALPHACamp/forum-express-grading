const assert = require('assert')
const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null // 判斷是否edit單筆，是的話會抓到req.params.id
    ])
      .then(([categories, category]) => {
        if (!categories.length) {
          return req.flash('error_messages', '還沒有種類清單')
        }
        return res.render('admin/categories', { categories, category })
      })
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
    const { name } = req.body
    assert(name, 'Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        assert(category, "Category doesn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        assert(category, "Category doesn't exist!")
        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully deleted!')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
