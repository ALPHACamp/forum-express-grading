const { Restaurant, User, Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {},
  putCategory: (req, res, next) => {},
  deleteCategory: (req, res, next) => {}
}

module.exports = categoryController
