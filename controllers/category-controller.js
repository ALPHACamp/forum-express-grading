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
  }
}

// 匯出模組
module.exports = categoryController
