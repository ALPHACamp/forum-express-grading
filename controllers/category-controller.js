const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is a must!')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
  // putCategories: (req, res) => {
  //   return res.render('categories')
  // },
  // deleteCategories: (req, res) => {
  //   return res.render('categories')
  // }
}

module.exports = categoryController
