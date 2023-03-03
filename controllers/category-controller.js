const { Category, Restaurant } = require('../models')

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
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    return Promise.all([
      Category.findByPk(req.params.id, {
        nest: true,
        include: [Restaurant]
      }),
      Category.findOne({ where: { name: '未分類' } }, {
        raw: true
      })
    ])
      .then(([category, noCategory]) => {
        if (!category) throw new Error("category didn't exist!")
        Promise.all(category.Restaurants.map(restaurant => restaurant.update({ categoryId: noCategory.id })))
          .then(() => category.destroy())
          .then(() => {
            req.flash('success_messages', 'category was successfully to delete')
            res.redirect('/admin/categories')
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  }
}
module.exports = categoryController
