const { Category } = require('../models')

const categoryController = {
  // [餐廳類別]============================
  getCategories: (req, res, next) => {
    return Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
