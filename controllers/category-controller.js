const { Category } = require('../models/category')
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  }
}
module.exports = categoryController
