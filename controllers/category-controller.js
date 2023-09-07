const { Restaurant, Category } = require('../models')

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
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', 'category was successfully created')
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
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  deleteCategory: async (req, res, next) => {
    const deleteCategoryId = req.params.id
    const uncategory = await Category.findOne({
      raw: true,
      where: { name: '未分類' }
    })
    const uncategoryId = uncategory.id
    // 反查deleteCategory是否存在
    try {
      const deleteCategory = await Category.findByPk(deleteCategoryId, { raw: true })
      if (!deleteCategory) { throw new Error("The category didn't exist!") }
      if (deleteCategory.name === '未分類') { throw new Error("You can't delete this category!") }
    } catch (err) {
      next(err)
    }
    // 找出與deleteCategoryId相關的餐廳
    try {
      const restaurants = await Restaurant.findAll({ where: { categoryId: deleteCategoryId } })
      if (restaurants) {
        await Restaurant.update({ categoryId: uncategoryId }, { // 將categoryId變成未分類的ID
          where: {
            categoryId: deleteCategoryId
          }
        })
      }
      await Category.destroy({ where: { id: deleteCategoryId } })
    } catch (err) {
      next(err)
    }
    res.redirect('/admin/categories')
  }
}

module.exports = categoryController
