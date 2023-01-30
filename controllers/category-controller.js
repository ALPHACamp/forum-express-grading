const { Category, Restaurant } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    const { id } = req.params
    return Promise.all([
      Category.findAll({ raw: true }),
      id ? Category.findByPk(id, { raw: true }) : null
    ])
      .then(([categories, category]) =>
        res.render('admin/categories', { categories, category })
      )
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
    const { id } = req.params
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    const { id } = req.params
    return Restaurant.findAll({ where: { categoryId: id } })
      .then(Restaurants => {
        Promise.all(
          Restaurants.map(
            Restaurant => Restaurant.update({ categoryId: 17 })
          )
        ).then(() =>
          Category.findByPk(id)
            .then(category => {
              if (!category) throw new Error("Category didn't exist!")
              return category.destroy()
            })
            .then(() => res.redirect('/admin/categories'))
            .catch(err => next(err))
        )
      })
  }
}

module.exports = categoryController
