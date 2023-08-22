const { Category, Restaurant } = require('../models')
const { deletedCategoryFilter, deletedCategoryId } = require('../helpers/deleted-filter-helper')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        categories = deletedCategoryFilter(categories)
        res.render('admin/categories', { categories, category })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('類別名稱不可為空')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', '新增分類成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('類別名稱不可為空')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error('此類別不存在')
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', '修改分類成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    return Promise.all([
      Category.findByPk(req.params.id),
      Restaurant.findAll({ where: { categoryId: req.params.id } })
    ])
      .then(async ([category, restaurants]) => {
        if (!category) throw new Error('此類別不存在')
        await Promise.all(restaurants.map(restaurant => { // 注意這裡用map才能取得返回值
          return restaurant.update({ categoryId: String(deletedCategoryId) })
        }))
        return await category.destroy()
      })
      .then(() => {
        req.flash('success_messages', '刪除類別成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
