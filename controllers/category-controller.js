const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => { // show all categories
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
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
        return res.redirect('/admin/categories')
      }
    } catch (error) {
      next(error)
    }
  }
}
module.exports = categoryController
