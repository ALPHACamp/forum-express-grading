const { Category } = require('../models')

const categoryController = {
  // 顯示
  getCategories: (req, res, next) => {
    return Promise.all([ // 抓Category資料 與 判斷網址是否有req.params.id，有就抓取Category相關資料，沒有回傳bull
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => { // 上面Promise分別存入變數
        res.render('admin/categories', { // 顯示以上兩個變數內容
          categories,
          category
        })
      })
      .catch(err => next(err))
  },
  // 新增
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name }) // 建立資料return回傳，then完成後轉址
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  // 修改
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id) // 抓網址:後資訊
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name }) // 回傳修改category資訊
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  // 刪除
  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!") // 反查，確認要刪除的類別存在，再進行下面刪除動作
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}
module.exports = categoryController
