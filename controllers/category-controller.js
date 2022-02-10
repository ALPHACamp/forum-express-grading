// 引入model
const { Category } = require('../models')

const categoryController = {
  // 渲染admin/categories頁面
  getCategories: (req, res, next) => {
    Promise.all([
      Category.findAll({ raw: true }), // 查詢所有category資料
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null // 判斷路由是否帶有id，有則查詢category資料，無則帶入null
    ])
      // 渲染admin/categories，並帶入參數， 頁面會依據category是否有值判斷現在是否為修改資料的頁面
      .then(([categories, category]) => res.render('admin/categories', { categories, category }))
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
  },

  // 更新category資料
  putCategory: (req, res, next) => {
    // 取得表單資料
    const { name } = req.body

    // 若表單資料沒有值，回傳錯誤
    if (!name) throw new Error('Category name is required')

    // 以路由動態id尋找category資料
    return Category.findByPk(req.params.id)
      .then(category => {
        // 若查詢不到資料，回傳錯諤
        if (!category) throw new Error("Category doesn't exist!")

        // 更新資料庫資訊
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories')) // 重新導向admin/categories
      .catch(err => next(err))
  },

  // 刪除category資料
  deleteCategory: (req, res, next) => {
    // 查詢動態路由id的category資料
    Category.findByPk(req.params.id)
      .then(category => {
        // 若查無資料，回傳錯誤訊息
        if (!category) throw new Error("Category doesn't exist!")

        // 刪除資料庫資料
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories')) // 重新導向admin/categories
      .catch(err => next(err))
  }
}

// 匯出模組
module.exports = categoryController
