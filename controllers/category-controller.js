const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    Category.create({
      name
    })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  editCategory: (req, res, next) => {
    Promise.all([
      Category.findAll({ raw: true }),
      Category.findByPk(req.params.id, { raw: true })
    ])
      .then(([categories, category]) => {
        return res.render('admin/edit-category', { categories, category })
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        category.update({
          name
        })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully to update')
        res.redirect('/admin/categories')
      })
  },
  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")

        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
