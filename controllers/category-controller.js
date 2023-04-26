const { Category } = require('../models')

const categoryController = {
  // 查詢所有 categories
  getCategories: (req, res, next) => {
    Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  }
}

module.exports = categoryController
