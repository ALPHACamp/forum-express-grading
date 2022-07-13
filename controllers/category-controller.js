const { Category } = require('../models')

module.exports = {
  getCategories: (req, res, next) => {
    const id = req.params.id
    return Category.findAll({ raw: true })
      .then(categories => {
        const category = categories.find(category => {
          return category.id === Number(id)
        })
        console.log(category)
        res.render('admin/categories', { categories, category })
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
    const id = req.params.id
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}