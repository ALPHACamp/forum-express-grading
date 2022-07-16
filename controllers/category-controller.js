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
  postCategories: (req, res, next) => {
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
    const categoryId = req.params.id
    Restaurant.findAll({ where: { categoryId } })
      .then(restaurants => {
        return restaurants.map(restaurant => restaurant.update({
          categoryId: 0
        })
        )
      })
      .then(() => {
        Category.findByPk(req.params.id)
          .then(category => {
            if (!category) throw new Error("Category didn't exist!")
            return category.destroy()
          })
          .then(() => {
            req.flash('success_message', 'Category was successfully to delete')
            res.redirect('/admin/categories')
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
