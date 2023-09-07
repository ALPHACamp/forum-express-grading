const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => {
        res.render('./admin/categories', { categories })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    console.log('function')
  },
  putCategory: (req, res, next) => {
    console.log('function')
  },
  deleteCategory: (req, res, next) => {
    console.log('function')
  }
}

module.exports = categoryController
