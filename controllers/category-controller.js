const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
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
  }
}
module.exports = categoryController
