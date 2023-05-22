const { Category } = require('../models')

module.exports = {
  getCategories: (req, res, next) => {
    const id = Number(req.params.id) || null
    return Category.findAll({ raw: true })
      .then(categories => {
        let editcontent
        categories.forEach(item => {
          if (item.id === id) editcontent = item
        })
        res.render('admin/categories', { categories, editcontent })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Name is required!')
    Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category created.')
        return Category.findAll({ raw: true })
      })
      .then(categories => res.redirect('/admin/categories', { categories }))
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const id = req.params.id
    const { name } = req.body
    Category.findByPk(id)
      .then(category => category.update({ name }))
      .then(() => {
        req.flash('success_messages', 'Edit category successfully.')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    const id = req.params.id
    Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('Category does not exists.')
        category.destroy()
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}
