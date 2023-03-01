const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    const id = req.params.id || null
    return Promise.all([
      Category.findByPk(id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([category, categories]) => {
        res.render('admin/categories', { category, categories })
      })
      .catch(err => next(err))
  },
  postCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  putCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.findByPk(req.params.id)
      .then(category => category.update({ name }))
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  deleteCategories: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("category didn't exist!")
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
