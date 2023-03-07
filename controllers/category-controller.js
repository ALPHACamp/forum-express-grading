// const db = require('../models')
// const Category = db.Category
const { Category } = require('../models') // 解構賦值

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  }
}
module.exports = categoryController
