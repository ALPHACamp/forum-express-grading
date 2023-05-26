// files
const { Category } = require('../models')

// controllers
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  }
}

// exports
module.exports = categoryController
