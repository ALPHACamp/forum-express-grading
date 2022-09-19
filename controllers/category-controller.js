const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const categoryName = req.body.categoryName
    if (!categoryName) throw new Error('Category name is required')
    return Category.create({ name: categoryName })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
