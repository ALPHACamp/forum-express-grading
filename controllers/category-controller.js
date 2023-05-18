const { Category, Restaurant } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      // 拿到全部categories
      const categories = await Category.findAll({ raw: true })

      await Promise.all(categories.map(async cat => {
        const res = await Restaurant.findAll({ where: { categoryId: cat.id }, raw: true })
        cat.restaurantsAmount = res.length
      }))

      // 拿到 params.id 沒有就不用
      const category = req.params.id ? await Category.findByPk(req.params.id) : null

      // response
      res.render('admin/categories', { categories, category })
    } catch (err) {
      next(err)
    }
  },
  postCategories: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },

  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error('Can not find category!')

        return category.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  // 刪除某類型的餐廳，保留類型
  deleteCategoryRestaurants: (req, res, next) => {
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error('Can not find category!')
        return category.getRestaurants({})
      })
      .then(restaurants => {
        return Promise.all(restaurants.map(res => res.destroy()))
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  // 刪除某類型，跟其餐廳
  deleteCategory: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id)
      const restaurants = await category.getRestaurants({})

      await Promise.all(restaurants.map(res => res.destroy()))
      await category.destroy()

      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
