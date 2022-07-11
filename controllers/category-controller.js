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
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully update')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}
module.exports = categoryController

// 寫入資料

//   putCategory: (req, res, next) => {
//     const { name } = req.body
//     if (!name) throw new Error('Category name is required!')
//     Category.findByPk(req.params.id)
//       .then(category => {
//         if (!category) throw new Error("Category didn't exist!")
//         return category.update({ name })
//       })
//       .then(() => {
//         req.flash('success_messages', 'Category was successfully to update')
//         res.redirect('/admin/categories/:id')
//       })
//       .catch(err => next(err))
//   },
//   deleteCategory: (req, res, next) => { // 新增以下
//     return Category.findByPk(req.params.id)
//       .then(category => {
//         if (!category) throw new Error("Category didn't exist!")
//         return category.destroy()
//       })
//       .then(() => res.redirect('/admin/categories'))
//       .catch(err => next(err))
//   }
// }
