const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({
      raw: true
      //   nest: true,
      //   include: [Category]
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    console.log('req.body:', req.body)
    const { name } = req.body // 從 req.body 拿出表單裡的資料
    if (!name || (name === ' ')) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
