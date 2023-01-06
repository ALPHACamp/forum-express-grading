const { Category } = require('../models')

const categoryController = {
  // 顯示全部分類 ＆ 新增 or 編輯輸入欄
  getCategories: (req, res, next) => {
    Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name.trim()) throw new Error("Category's name is required")
    Category.findOne({ where: { name: name.trim() } })
      .then(isExist => {
        if (isExist) throw new Error("Category's name is already existed")
        Category.create({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
