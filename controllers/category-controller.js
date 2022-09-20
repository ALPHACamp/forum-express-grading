const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    if (req.params.id) {
      return Promise.all([Category.findByPk(req.params.id, { raw: true }), Category.findAll({ raw: true })])
        .then(([category, categories]) => res.render('admin/edit-category', { category, categories }))
    }
    Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const categoryName = req.body.categoryName
    if (!categoryName) throw new Error('Category name is required')
    return Category.create({ name: categoryName })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const categoryId = req.params.id
    const categoryName = req.body.categoryName
    return Category.update({ name: categoryName }, { where: { id: categoryId } })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
