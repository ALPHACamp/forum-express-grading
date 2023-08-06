
const { Category } = require('../models')

const categoryController = {

  // (頁面)瀏覽所有分類
  getCategories: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },

  // (功能)新增一筆分類
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },

  // (功能)更新一筆分類
  putCategory: (req, res, next) => {

  },

  // (功能)刪除一筆分類
  deleteCategory: (req, res, next) => {

  }
}

module.exports = categoryController
