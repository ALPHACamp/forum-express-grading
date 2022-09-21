const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admins/categories', { categories }))
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
  }
}

module.exports = categoryController
