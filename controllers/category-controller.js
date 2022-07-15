const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => {
        const category = categories.filter(
          cate => cate.id === Number(req.params.id)
        )
        return res.render('admin/categories', {
          categories,
          category: category[0]
        })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const name = req.body.name
    if (!name) {
      throw new Error('Category Name is required')
    }
    Category.create({ name })
      .then(() => {
        req.flash(
          'success_messages',
          `Category : ${name} was successfully created`
        )
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    if (!req.body.name) {
      throw new Error('Category Name is required')
    }
    return Category.update(
      { name: req.body.name },
      { where: { id: req.params.id } }
    )
      .then(() => {
        req.flash(
          'success_messages',
          `Category: ${req.body.name} was successfully update`
        )
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) {
          throw new Error('Categroy is not exist')
        }
        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully delete')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}
module.exports = categoryController
