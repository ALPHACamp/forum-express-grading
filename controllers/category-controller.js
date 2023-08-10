const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', {
          categories,
          category
        })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const name = req.body.name.trim()
    if (!name) throw new Error('Category name is required!')
    return Category.findOne({
      where: { name }
    })
      .then(category => {
        if (category) throw new Error('The category name already exists!')
        return Category.create({ name })
      })
      .then(() => {
        req.flash('success_messages', 'New Category is created successfully.')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const name = req.body.name.trim()
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'The Category is edited successfully.')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
