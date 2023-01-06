const { Category } = require('../models')

const categoryController = {
  // 顯示全部分類 ＆ 新增 or 編輯輸入欄
  getCategories: (req, res, next) => {
    const { id } = req.params
    // params 不存在 => 單純呈現所有分類
    if (!id) {
      return Category.findAll({
        raw: true
      })
        .then(categories => res.render('admin/categories', { categories }))
        .catch(err => next(err))
    } else {
    // params 存在 => 呈現所有分類＋編輯表單
      Promise.all([
        Category.findAll({ raw: true }),
        Category.findByPk(id)
      ])
        .then(([categories, category]) => res.render('admin/categories', { categories, category: category.toJSON() }))
        .catch(err => next(err))
    }
  },
  postCategory: (req, res, next) => {
    const name = req.body.name.trim()
    if (!name) throw new Error("Category's name is required")
    Category.findOne({ where: { name } })
      .then(isExist => {
        if (isExist) throw new Error("Category's name is already existed")
        Category.create({ name })
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { id } = req.params
    const name = req.body.name.trim()
    if (!name) throw new Error("Category's name is required")
    Category.findOne({ where: { name } })
      .then(isExist => {
        if (isExist) throw new Error("Category's name is already existed")
        return Category.findByPk(id)
      })
      .then(category => category.update({ name }))
      .then(() => {
        req.flash('success_messages', 'Category was successfully updated')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    const { id } = req.params

    Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error("Category isn't existed!")
        // 進入刪除流程(使用預設的 SET NULL)
        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully deleted')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
