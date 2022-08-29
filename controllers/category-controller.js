const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/index', { categories }))
      .catch(err => next(err))
  }
}

module.exports = categoryController
