const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null // 檢查 req.params.id 這個變數是否存在。如果存在，在資料庫查詢階段，除了全部類別資料外，還需要撈出這個 id 對應的那一筆資料。如果不存在，直接存成空值即可。
    ])
      .then(([categories, category]) => res.render('admin/categories', {
        categories,
        category
      }))
      .catch(err => next(err))
  },
  postCategories: (req, res, next) => {
    const { name } = req.body

    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'category was successfully created')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body

    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
