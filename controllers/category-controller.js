const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({
      raw: true
    })
      .then(categories => {
        res.render('admin/categories', { categories })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => { // create
    const { name } = req.body
    if (!name) throw new Error('Category name is required.')
    Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  getCategory: (req, res, next) => { // browse edit
    Category.findAll({
      raw: true
    })
      .then(categories => {
        res.render('admin/categories', { categories })
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    Category.findByPk(req.params.id)
      .then(category => {
        category.update({
          name
        })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        category.destroy()
      })
      .catch(err => next(err))
  }
}
module.exports = categoryController
