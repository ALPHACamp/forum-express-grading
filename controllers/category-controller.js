const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('name is not define')

    Category.create({
      name
    })
      .then(() => {
        req.flash('success_messages', 'categories was successfully created')
        res.redirect('admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
