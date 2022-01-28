const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/categories', { categories }))
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
    // if (!name) throw new Error('Category name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    // Category.findOne({ where: { name } })
    //   .then(category => {
    //     if (category) throw new Error('Email already exists!')
    //     return Category.create({ name })
    //       .then(() => {
    //         req.flash('success_messages', `Category ${name}  was successfully created`) // 在畫面顯示成功提示
    //         res.redirect('/admin/categories') // 新增完成後導回後台首頁
    //       })
    //       .catch(err => next(err))
    //   })
  }
}
module.exports = categoryController
