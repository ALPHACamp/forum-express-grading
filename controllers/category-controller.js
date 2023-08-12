const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    if (req.params.id === 'all') {
      Category.findAll({ raw: true })
        .then(categories => res.render('admin/categories', { categories, category: false }))
        .catch(err => next(err))
    } else {
      Promise.all([ // 非同步處理
        Category.findAll({ raw: true }),
        Category.findByPk(req.params.id, { raw: true })
      ])
        .then(([categories, category]) => res.render('admin/categories', { categories, category }))
        .catch(err => next(err))
    }
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({
      name
    })
      .then(() => {
        req.flash('success_messages', 'Category was successfully updated')
        res.redirect('/admin/categories/all')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.update({
          name
        })
      }
      )
      .then(() => {
        req.flash('success_messages', 'Category was successfully updated')
        res.redirect('/admin/categories/all')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories/all'))
      .catch(err => next(err))
  }
}
module.exports = categoryController
