const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  //
  createCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  //
  editCategory: (req, res, next) => {
    console.log('edit')
  },
  //
  deleteCategory: (req, res, next) => {
    console.log('delete')
  }
}

module.exports = categoryController
