const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => {
        res.render('admin/categories', { categories })
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
  }
}

module.exports = categoryController
