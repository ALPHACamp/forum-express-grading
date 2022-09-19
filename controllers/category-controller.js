const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      Category.findByPk(req.params.id, { raw: true })
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })})
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required！')
    return Category.create({
      name
    })
      .then(() => {
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
  // putCategory: (req, res, next) => {
  //   const name = req.body.name
  //   Category.findByPk(req.params.id)
  //     .then(category => {
  //       category.update({
  //         name
  //       })
  //       res.redirect('/admin/categories')
  //     })
  //     .catch(err => next(err))
  // }
}

module.exports = categoryController
