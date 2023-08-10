const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => res.render('admin/categories', { categories, category }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body // 從 req.body 拿出表單裡的資料
    if (!name || (name.replace(/ /g, '') === '')) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name || (name.replace(/ /g, '') === '')) throw new Error('Category name is required!')
    Category.findByPk(req.params.id)
      .then(Category => {
        if (!Category) throw new Error("Category didn't exist!")
        return Category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }

}

module.exports = categoryController
