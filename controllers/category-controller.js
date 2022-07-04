const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
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
  }
}

module.exports = categoryController
