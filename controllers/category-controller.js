const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    const { id } = req.params
    return Promise.all([
      Category.findAll({ raw: true }),
      id ? Category.findByPk(id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => res.redirect('/admin/Categories'))
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(id).then(category => {
      if (!category) throw new Error('Category didnt exist!')
      return category.update({ name })
    })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
