const { Category, Restaurant } = require('../models')

module.exports = {
  getCategories: async (req, res, next) => {
    try {
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
      ])
      res.render('admin/categories', { categories, category })
    } catch (err) { next(err) }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      await Category.create({ name })
      res.redirect('/admin/categories')
    } catch (err) { next(err) }
  },
  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')

      const category = await Category.findByPk(req.params.id)
      if (!category) throw new Error("Category doesn't exist!")
      await category.update({ name })

      res.redirect('/admin/categories')
    } catch (err) { next(err) }
  },
  deleteCategory: async (req, res, next) => {
    try {
      // Find delete target
      const categoryDelete = await Category.findByPk(req.params.id)
      if (!categoryDelete) {
        req.flash('error_messages', "Category doesn't exist!")
        return res.redirect('back')
      }

      // Find replace target
      const categoryReplace = await Category.findOne({
        where: { name: '(未分類)' },
        raw: true
      })
      if (!categoryReplace) {
        req.flash('error_messages', "Category '(未分類)' doesn't exist!")
        return res.redirect('back')
      }

      // Replace category to 'Uncategorizes'
      await Restaurant.update({ categoryId: categoryReplace.id }, {
        where: { categoryId: categoryDelete.id }
      })
      // Delete target category
      await categoryDelete.destroy()
      req.flash('success_messages', 'Category deleted. Related restaurants are updated to category-(未分類)!')
      res.redirect('/admin/categories')
    } catch (err) { next(err) }
  }
}
