const {Category} = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({ raw: true }).then(categories => {
      res.render('admin/categories', { categories })
    })
  },
  postCategory: (req, res, next) => {},
  putCategory: (req, res, next) => {},
  deleteCategory: (req, res, next) => {}
}

module.exports = categoryController
