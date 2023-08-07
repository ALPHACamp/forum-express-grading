const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => {
        res.render('admin/categories', { categories })
      })
      .catch(err => console.log(err))
  }
}

module.exports = categoryController
