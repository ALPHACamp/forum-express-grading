const { Restaurant, User, Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return (
      Promise.all([
        Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
      ])
        /* 以前者為例，Promise結果為
        [
        [{id: 1,name: '中式料理'},{id: 2,name: '日本料理',},... ],
        [null]
        ]
        */
        // 所以then必須加中括號，才能在hbs讀取each categories。
        // 沒加的話只會有兩筆資料(2個index)，第一筆資料無法讀取所以空白，第二筆null所以空白。
        .then(([categories, category]) =>
          res.render('admin/categories', { categories, category })
        )
        .catch(err => next(err))
    )
  },
  postCategory: (req, res, next) => {
    const { name } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Category name is required!')

    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'Category was successfully created!')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name }) // 注意是小寫c
      })
      .then(() => {
        req.flash('success_messages', 'Category was successfully to update')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
