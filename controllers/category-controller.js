const { Category } = require('../models')

const categoryController = {
  // [餐廳類別]============================
  getCategories: (req, res, next) => {
    return Category.findAll({
      raw: true,
      nest: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  }
}

module.exports = categoryController
