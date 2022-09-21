const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([Category.findAll({ raw: true }), Category.findByPk(req.params.id, { raw: true })])
      .then(([categories, category]) => res.render('admins/categories', { categories, category })
      )
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const name = req.body.name.trim()
    if (!name) throw new Error('CategoryName must be required')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category is created')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const name = req.body.name.trim()
    if (!name) throw new Error('CategoryName must be required')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist")
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category is updated')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
