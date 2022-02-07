// 引入model
const { Category } = require('../models')

const categoryController = {
  // 渲染admin/categories頁面
  getCategories: (req, res, next) => {
    // 查詢所有category資料
    return Category.findAll({
      raw: true
    })
      // 渲染admin/categories頁面，並帶入categories資料
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },

  // 新增category
  postCategory: (req, res, next) => {
    // 取得表單資料
    const { name } = req.body

    // 判斷name是否有值， 無值丟出一個error物件
    if (!name) throw new Error('Category name is required')

    // 新增資料庫資料
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories')) // 重新導向admin/categories
      .catch(err => next(err))
  }
}

// 匯出模組
module.exports = categoryController
