const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    Category.findOne({ where: { name } })
      .then(category => {
        if (category) throw new Error('Category is already exist!')
        Category.create({ name })
      })
      .then(() => res.redirect('categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
