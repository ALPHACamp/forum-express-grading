const { Category, Restaurant } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', {
          categories,
          category
        })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully update')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    // 檢查該分類是否已被使用
    return Promise.all([
      Restaurant.findOne({
        attributes: ['category_id'],
        where: { category_id: req.params.id },
        raw: true
      }),
      Category.findByPk(req.params.id)
    ])
      .then(([restaurants, category]) => {
        if (!category) throw new Error("Category didn't exist!")
        // 若為是，則不刪除，將名稱改為未分類
        if (restaurants) {
          return category.update({ name: '(未分類)' })
        } else {
          return category.destroy()
        }
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}
module.exports = categoryController
