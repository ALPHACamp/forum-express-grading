const { Category, Restaurant } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null,
      Restaurant.getCountByCategory()
    ])
      .then(([categories, category, restaurantCount]) => {
        restaurantCount.forEach(categoryId => {
          for (let i = 0; i < categories.length; i++) {
            if (categoryId.categoryId === categories[i].id) {
              categories[i].amount = categoryId.amount
              categories[i].noRestaurant = true
              break
            } else { }
          }
        })
        return res.render('admin/categories', {
          categories,
          category
        })
      })
      .catch(err => next(err))
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      if (!name) throw new Error('Category name is required!')
      const category = await Category.findOne({ where: { name } })
      if (category) throw new Error(`Category ${name} already exists!`)

      await Category.create({ name })
      req.flash('success_messages', `Category ${name}  was successfully created`) // 在畫面顯示成功提示
      res.redirect('/admin/categories')
    } catch (err) { next(err) }
    // const { name } = req.body
    // if (!name) throw new Error('Category name is required!')
    // Category.findOne({ where: { name } })
    //   .then(category => {
    //     if (category) throw new Error('Email already exists!')
    //     return Category.create({ name })
    //       .then(() => {
    //         req.flash('success_messages', `Category ${name}  was successfully created`)
    //         res.redirect('/admin/categories')
    //       })
    //       .catch(err => next(err))
    //   })
  },
  putCategory: (req, res, next) => {
    return Promise.all([
      Category.findOne({ where: { name: req.body.name } }),
      Category.findByPk(req.params.id)
    ])
      .then(([category, nowCategory]) => {
        const { name } = req.body
        if (!name) throw new Error('Category name is required!')
        if (category) throw new Error(`Category ${name} already exists!`)
        if (!nowCategory) throw new Error("Category doesn't exist!")
        return nowCategory.update({ name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.destroy()
      })
      .then(category => {
        req.flash('success_messages', `Category ${category.name}  was successfully deleted`)
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}
module.exports = categoryController
