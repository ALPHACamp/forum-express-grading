const { Category, Restaurant } = require('../models')

const categoryController = {
  // show all categories, and create/edit input according to req.params.id
  getCategories: (req, res, next) => {
    return Promise
      .all([
        Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
      ])
      .then(([categories, category]) => res.render('admin/categories', { categories, category }))
      .catch(err => next(err))
  },

  postCategory: (req, res, next) => {
    const name = req.body.name.trim()
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created.')
        res.redirect('/admin/categories')
      })
      .catch(e => next(e))
  },

  putCategory: (req, res, next) => {
    const name = req.body.name.trim()
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },

  deleteCategory: async (req, res, next) => {
    try {
      // find the category user wants to delete
      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category doesn't exist!")
      // delete the restaurants under the category
      await Restaurant.destroy({ where: { categoryId: category.id } })
      // delete the category
      await category.destroy()
      req.flash('success_messages', 'Category and the related restaurants were successfully deleted.')
      res.redirect('/admin/categories')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = categoryController
