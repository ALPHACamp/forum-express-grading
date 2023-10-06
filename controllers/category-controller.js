const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.cid ? Category.findByPk(req.params.cid, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        // if (!category) throw Error("Category doesn't exist!") // 不需要這行，因為category可以不存在
        return res.render('admin/categories', { categories, category })
      }
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
    // find the date that user wants to update
    const { name } = req.body
    // if no value => warn
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.cid)
      // update
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      // redirect
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
