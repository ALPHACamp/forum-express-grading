const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([Category.findAll({ raw: true }), req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
      })
      .catch(err => next(err))
  },

  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('請輸入類別名稱')

    Category.findOne({ where: { name } })
      .then(category => {
        if (category) throw new Error('類別名稱已存在')
        return Category.create({ name })
      })
      .then(category => {
        req.flash('success_animation', category.id)
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },

  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('請輸入類別名稱')

    return Promise.all([Category.findAll({ where: { name }, raw: true }), req.params.id ? Category.findByPk(req.params.id) : null])
      .then(([categories, category]) => {
        // 搜尋錯誤，此 id 不存在
        if (!category) throw new Error("類別不存在")
        // 沒改變，不更新
        if (category.name === name) return req.flash('success_animation', req.params.id)
        // 有改變，檢查是不是已經存在
        if (categories.length > 0) throw new Error('類別名稱已存在')
        // 有改變，沒有重複
        req.flash('success_animation', req.params.id)
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },

  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("類別不存在")
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
