const { Category } = require('../models')
module.exports = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({ raw: true })
      res.render('admin/categories', { categories })
    } catch (error) {
      next(error)
    }
  },
  postCategories: async (req, res, next) => {
    try {
      const { name } = req.body
      console.log(name)
      if (!name) {
        req.flash('error_messges', 'Name can\'t be empty')
        return res.redirect('/admin/categories')
      }
      await Category.create({ name })
      req.flash('sussage_messages', `${name}新增成功`)
      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  }
}
