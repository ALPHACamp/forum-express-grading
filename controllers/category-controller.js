const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
  },
  postCategory: (req, res, next) => {
    const name = req.body.name.trim()
    if (!name) throw new Error('Category name is required!')
    return Category.findOne({
      where: {name}
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
  }
}

module.exports = categoryController
