const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    const { id } = req.params

    return Promise.all([
      Category.findAll({ raw: true }),
      id ? Category.findByPk(id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        return res.render('admin/categories', {
          categories, category
        })
      })
      .catch(err => next(err))
  },

  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },

  putCategory: (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exists")

        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully updated')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },

  deleteCategory: (req, res, next) => {
    const { id } = req.params

    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exists")

        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully deleted')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
