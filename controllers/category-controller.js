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
    if (!name) throw new Error('Category name is required!')

    Category.findOne({ where: { name } })
      .then(category => {
        if (category) throw new Error('Category name exists')
        return Category.create({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },

  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Promise.all([Category.findAll({ where: { name }, raw: true }), req.params.id ? Category.findByPk(req.params.id) : null])
      .then(([categories, category]) => {
        // 搜尋錯誤，此 id 不存在
        if (!category) throw new Error("Category doesn't exist!")
        // 沒改變，不更新
        if (category.name === name) return
        // 有改變，檢查是不是已經存在
        if (categories.length > 0) throw new Error('Category name exists!')
        // 有改變，沒有重複
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },

  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
