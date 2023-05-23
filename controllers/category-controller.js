const { Restaurant, Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    const id = req.params.id
    Promise.all([
      Category.findAll({ raw: true }),
      id ? Category.findByPk(id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
      })
      .catch(e => next(e))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(e => next(e))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(e => next(e))
  },
  deleteCategory: async (req, res, next) => {
    // 進階刪除: 如果要刪除'未分類'這個category還是會出錯, 源頭還是要解決Foreign Key Constraint Error的問題
    try {
      const category = await Category.findByPk(req.params.id, {
        nest: true,
        include: [Restaurant]
      })
      if (!category) throw new Error("Category didn't exist!")
      // 找出屬於此分類的餐廳有哪些, 並把id整合成新array例如 : [1, 15 , 23 , 25]
      const changeRestaurantId = category.Restaurants.map(rest => rest.toJSON().id)
      // 找出'未分類'的id並把這些餐廳的categoryId改成該id
      const uncategorized = await Category.findOne({ where: { name: '未分類' } }, { raw: true })
      await Restaurant.update({ categoryId: uncategorized.id }, { where: { id: changeRestaurantId } })

      // 改完之後再刪除分類
      await category.destroy()

      req.flash('success_messages', 'Category was successfully deleted')
      res.redirect('/admin/categories')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = categoryController
