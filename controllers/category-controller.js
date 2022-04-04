const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', {
          categories,
          category
        })
      })
      .catch(err => next(err))
  },

  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('未輸入分類名稱')
      const category = await Category.findOne({ where: { name } })
      if (category) throw new Error(`已經有 ${name} 這項分類`)
      await Category.create({ name })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },

  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }

}
module.exports = categoryController
