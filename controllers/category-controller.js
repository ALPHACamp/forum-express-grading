// const db = require('../models')
// const Category = db.Category
const { Category } = require('../models') // 解構賦值

const categoryController = {
  getCategories: (req, res, next) => { // 瀏覽分類頁面
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => { // 新增分類
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}
module.exports = categoryController
