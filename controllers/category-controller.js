const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findOne({
      where: { name }
    })
      .then(category => {
        if (category) throw new Error('The category name already exists!')
        return Category.create({ name })
      })
      .then(() => {
        req.flash('success_messages', 'New category is created successfully!')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    const id = req.params.id
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('Category does not exist!')
        return category.update({ name })
      })
      .then(() => {
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
