const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/index', { categories }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('類別名稱為必填')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
