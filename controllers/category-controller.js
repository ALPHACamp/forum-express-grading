const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  }

  // postCategories: (req, res) => {
  //   return res.render('categories')
  // },
  // putCategories: (req, res) => {
  //   return res.render('categories')
  // },
  // deleteCategories: (req, res) => {
  //   return res.render('categories')
  // }
}

module.exports = categoryController
