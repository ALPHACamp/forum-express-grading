const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    const { id } = req.params

    return Category.findAll({ raw: true })
      .then(categories => {
        const selectedCategory = id
          ? categories.find(item => item.id === Number(id))
          : null

        return res.render('admin/categories', {
          categories, selectedCategory
        })
      })
      .catch(err => next(err))
  },

  postCategory: (req, res, next) => {
    const { name } = req.body

    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },

  putCategory: (req, res, next) => {
    const { id } = req.params
    const { name } = req.body

    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exists")

        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully updated')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },

  deleteCategory: (req, res, next) => {
    const { id } = req.params

    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exists")

        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully deleted')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
