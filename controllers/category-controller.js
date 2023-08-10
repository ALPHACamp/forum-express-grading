const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => {
        console.log(categories)
        res.render('admin/categories', { categories })
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
  }
}

module.exports = categoryController
