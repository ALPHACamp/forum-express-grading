const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      Category.findByPk(id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([category, categories]) => {
        res.render('admin/categories', { category, categories })
      })
      .catch(error => next(error))
  },
  postCategories: (req, res, next) => {
    const { categoryName } = req.body
    Category.findOne({ where: { name: categoryName.trim() } })
      .then(category => {
        if (category) throw new Error(`${category.name} 已經建立了`)

        return Category.create({ name: categoryName })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(error => next(error))
  },
  putCategory: (req, res, next) => {
    const id = req.params.id
    const { categoryName } = req.body

    Category.findByPk(id) // 這邊要注意不用轉換
      .then(category => {
        if (!category) throw new Error("Category isn't exist!")

        category.update({ name: categoryName })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(error => next(error))
  },
  deleteCategory: (req, res, next) => {
    const id = req.params.id

    Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error("Category isn't exist!")

        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', '刪除成功!')
        res.redirect('/admin/categories')
      })
      .catch(error => next(error))
  }
}

module.exports = categoryController
