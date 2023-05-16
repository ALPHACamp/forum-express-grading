const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    const id = req.params.id
    Promise.all([
      Category.findAll({ raw: true }),
      id ? Category.findByPk(id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
      })
      .catch(e => next(e))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.create({ name }).then(() => res.redirect('/admin/categories'))
      .catch(e => next(e))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(e => next(e))
  },
  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully deleted')
        res.redirect('/admin/categories')
      })
      .catch(e => next(e))
  }
}

module.exports = categoryController
