const { Category } = require('../models')

const categoryController = {
  getCategories: (req, res, next) => {
    return Promise.all([ // 此兩種非同步事件並無先後，只要找完資料後執行即可
      Category.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([category, categories]) => {
        // if (!category) throw new Error("Category didn't exist!")
        res.render('admin/categories', { category, categories })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Category name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    Category.create({ name }) // 產生一個新的 Category 物件實例，並存入資料庫
      .then(() => {
        req.flash('success_messages', 'Category was successfully created') // 在畫面顯示成功提示
        return res.redirect('/admin/categories') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        category.update({ name })
        req.flash('success_messages', 'Category was successfully to update')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  deleteCategory: (req, res, next) => {
    return Category.findByPk(req.params.id)
      .then(categories => {
        console.log(categories)
        if (!categories) throw new Error("Category didn't exist!")
        return categories.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(err => next(err))
  }
}

module.exports = categoryController
