const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({ raw: true, nest: true })
      .then(categories => {
        if (req.params.id) {
          Category.findByPk(req.params.id)
            .then(category => {
              return res.render('admin/categories', { categories, category: category.toJSON() })
            })
            .catch(err => console.log(err))
        } else {
          return res.render('admin/categories', { categories })
        }
      })
      .catch(err => console.log(err))
  },
  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_msg', '請輸入類別名稱！')
      return res.redirect('back')
    } else {
      return Category.create({ name })
        .then(category => {
          res.redirect('/admin/categories')
        })
    }
  },
  putCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_msg', '請輸入類別名稱！')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update({ name })
            .then(category => {
              res.redirect('/admin/categories')
            })
        })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(category => {
            res.redirect('/admin/categories')
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
}

module.exports = categoryController