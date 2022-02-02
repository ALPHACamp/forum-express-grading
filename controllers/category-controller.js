const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      Category.findAll({ raw: true }),
      id ? Category.findByPk(id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
      })
      .catch(error => next(error))
  },
  postCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'category was successfully created')
        res.redirect('/admin/categories')
      })
      .catch(error => next(error))
  },
  putCategory: (req, res, next) => {
    const id = req.params.id
    const { name } = req.body

    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('Category doesn\'t exist!')
        return category.update({
          name
        })
      })
      .then(() => {
        req.flash('success_messages', 'category was successfully updated')
        res.redirect('/admin/categories')
      })
      .catch(error => next(error))
  },
  deleteCategory: (req, res, next) => {
    const id = req.params.id

    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('Category doesn\'t exist!')
        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'category was successfully removed')
        res.redirect('/admin/categories')
      })
      .catch(error => next(error))
  }
}

exports = module.exports = categoryController
