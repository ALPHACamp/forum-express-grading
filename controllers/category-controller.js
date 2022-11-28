const { Restaurant, User, Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Category name is required!')

    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created!')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {},
  deleteCategory: (req, res, next) => {}
}

module.exports = categoryController
