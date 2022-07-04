const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => res.render('admin/categories', { categories, category }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created') // 在畫面顯示成功提示
        res.redirect('/admin/categories') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")

        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully updated') // 在畫面顯示成功提示
        res.redirect('/admin/categories') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
