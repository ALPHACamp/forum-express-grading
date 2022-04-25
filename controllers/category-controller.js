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
    const name = req.body.name
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'category was successfully created')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  editCategory: (req, res, next) => {
    return Category.findByPk(req.params.id, { raw: true })
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        res.render('admin/categories', { category })
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
          .then(() => {
            req.flash('success_messages', `已更新為${category.name}`)
            res.redirect('/admin/categories')
          })
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.destroy()
          .then(() => {
            req.flash('success_messages', `成功刪除${category.name}`)
            res.redirect('/admin/categories')
          })
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
