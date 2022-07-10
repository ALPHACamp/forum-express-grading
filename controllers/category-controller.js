const { Category } = require('../models')
const categoryController = {
  getCategories: async (req, res, next) => { // show all categories
    try {
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        Category.findByPk(req.params.cat_id, { raw: true })
      ])

      return res.render('admin/categories', {
        categories,
        category
      })
    } catch (error) {
      next(error)
    }
  },
  putCategory: async (req, res, next) => { // update a category into database
    try {
      let { name } = req.body
      name = name.trim()
      if (!name) throw new Error('Category name is required!')

      let category = await Category.findOne(
        { where: { name: name } }
      )
      if (category !== null) {
        throw new Error('Category name exists!')
      } else {
        category = await Category.findByPk(req.params.cat_id)
        await category.update({ name })
        req.flash('success_messages', 'category update successfully')
        return res.redirect('/admin/categories')
      }
    } catch (error) {
      next(error)
    }
  },
  postCategory: async (req, res, next) => { // create new category into database
    try {
      let { name } = req.body
      name = name.trim()
      if (!name) throw new Error('Category name is required!')
      const category = await Category.findOne(
        { where: { name: name } }
      )
      if (category !== null) {
        throw new Error('Category name exists!')
      } else { // category === null
        await Category.create({ name })
        req.flash('success_messages', 'category create successfully')
        return res.redirect('/admin/categories')
      }
    } catch (error) {
      next(error)
    }
  }
}
module.exports = categoryController
