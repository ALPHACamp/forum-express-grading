const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({
        raw: true
      }),
      req.params.id
        ? Category.findByPk(req.params.id, { raw: true })
        : null
    ])

      .then(([categories, category]) =>
        res.render('admin/categories', { categories, category }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    Category.findByPk(req.params.id)

      .then(category => {
        if (!category) throw new Error('Category does not exist!')

        return category.update({
          name

        })
      })
      .then(() => {
        // req.flash('success_messages', 'category was successfully to update')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
