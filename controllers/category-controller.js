const { Restaurant, Category } = require('../models')
const { isAttached } = require('../middleware/data-helper')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const [category, categories] = await Promise.all([
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null,
        Category.findAll({ raw: true })
      ])
      return res.render('admin/categories', {
        category,
        categories,
        script: 'admin/categories'
      })
    } catch (error) {
      next(error)
    }
  },

  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Please enter category name!')
      await Category.findOrCreate({ where: { name } })

      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },

  putCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Please enter category name!')
      await Category.update({ name }, { where: { id: req.params.id } })

      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },

  deleteCategory: async (req, res, next) => {
    // Check delete method
    try {
      const categoryId = req.params.id
      const deleteOption = req.query.option || null

      // No attach, delete category directly
      if (!deleteOption) await Category.destroy({ where: { id: categoryId } })

      // Delete category along with all restaurant
      if (deleteOption === 'deleteAll') {
        await Restaurant.destroy({ where: { categoryId } })
        await Category.destroy({ where: { id: categoryId } })
      }

      // Delete category and replace it with '未分類'
      if (deleteOption === 'replace') {
        // Find '未分類' category id or create one if not found
        // eslint-disable-next-line no-unused-vars
        const [nullCategory, _created] = await Category.findOrCreate({ where: { name: '未分類' } })

        // Replace restaurants' category id with replace id
        await Restaurant.update(
          { categoryId: nullCategory.id },
          { where: { categoryId } }
        )

        // Delete original category
        await Category.destroy({ where: { id: categoryId } })
      }

      return res.redirect('/admin/categories')
    } catch (error) {
      next(error)
    }
  },

  // Check if category is attached to any restaurant
  checkAttachment: async (req, res, next) => {
    try {
      console.log('activate')
      // Find if any restaurant is attached to this category (Reference middleware/data-helper.js)
      if (await isAttached(req.params.id, Restaurant, 'categoryId')) {
        return res.json(true)
      }
      return res.json(false)
      // If so, ask admin to decide how to keep it or delete it
    } catch (error) {
      next(error)
    }
  },

  // If category is attached with restaurant, select one delete method choose by admin
  deleteCategoryByOption: (req, res, next) => {

  }
}

module.exports = categoryController
