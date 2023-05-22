const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(category => res.render('admin/categories', { category }))
      .catch(err => next(err))
  }
}

module.exports = categoryController
