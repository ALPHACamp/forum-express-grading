const { Category } = require('../models')

const cateogryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories })
      )
      .catch(err => next(err))
  }
}

module.exports = cateogryController
