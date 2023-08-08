const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
      })
      .catch(err => next(err))
  },
  createCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('category name didn\'t exist')
    return Category.findAll({ raw: true })
      .then(categories => {
        const isNameExist = categories.some(category => category.name === name)
        if (isNameExist) throw new Error('category name is already exist')
        return Category.create({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('category name didn\'t exist')

    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error('category didn\'t exist')
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
