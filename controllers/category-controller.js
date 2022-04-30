const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => res.render('admin/categories', { categories, category }))
      .catch(err => next(err))
  },

  postCategory: (req, res, next) => {
    // 沒有作重複名稱篩選，之後可以加上
    const { name } = req.body
    if (!name) throw new Error('Category Name is required!')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => console.log(err))
  },

  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category Name is required!')

    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
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
