const { Restaurant, Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const [categories, category] = await Promise.all([
        Category.findAll({ raw: true }),
        // 檢查 req.params.id 是否存在
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
      ])
      res.render('admin/categories', {
        categories,
        category
      })
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
      const category = await Category.findByPk(req.params.id)

      if (!category) throw new Error("Category doesn't exist!")

      // 1.直接把相關的餐廳刪除，大量刪除(，加 WHERE)
      // await Restaurant.destroy({ where: { categoryId: req.params.id } })

      // 3.保留餐廳，標示為 未分類
      // findOrCreate 回傳array [instance, boolean]
      const uncategorized = await Category.findOrCreate({
        raw: true,
        where: { name: '未分類' }
      })

      // 大量修改，加 WHERE
      await Restaurant.update(
        /* set attributes' value */
        { categoryId: uncategorized[0].id },
        /* condition for find */
        { where: { categoryId: req.params.id } }
      )
      // 刪除分類
      await category.destroy()

      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
