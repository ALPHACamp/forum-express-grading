const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([Category.findAll({ raw: true }), req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null])
      .then(([categories, category]) => res.render('admin/categories', { categories, category }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const categoryId = req.params.id
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.update({ name }, { where: { id: categoryId } })
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    const categoryId = req.params.id
    // return Category.findByPk(categoryId)
    //   .then(category => category.destroy())
    return Category.destroy({ where: { id: categoryId } })
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
