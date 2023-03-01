const { Category, Restaurant } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    const id = req.params.id || null
    return Promise.all([
      Category.findByPk(id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([category, categories]) => {
        res.render('admin/categories', { category, categories })
      })
      .catch(err => next(err))
  },
  postCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category was successfully to create')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.findByPk(req.params.id)
      .then(category => category.update({ name }))
      .then(() => {
        req.flash('success_messages', 'Category was successfully to update')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategories: (req, res, next) => {
    return Promise.all([
      Category.findByPk(req.params.id, {
        nest: true,
        include: [Restaurant]
      }),
      Category.findOne({ where: { name: '分類不存在' } }, {
        raw: true
      })
    ])
      .then(([category, categoryRaw]) => {
        if (!category) throw new Error("category didn't exist!")
        Promise.all(category.Restaurants.map(restaurant => restaurant.update({ categoryId: categoryRaw.id })
        ))
          .then(() => category.destroy())
          .then(() => {
            req.flash('success_messages', 'Category was successfully to delete')
            res.redirect('/admin/categories')
          })
          .catch(err => next(err))
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
