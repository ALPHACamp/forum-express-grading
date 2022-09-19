const { Category } = require('../models')

exports.getCategories = async (req, res, next) => {
 try {
    const pageSize = 15
    const currPage = +req.query.page || 1
    const [{ count, rows }, category] = await Promise.all([Category.findAndCountAll({
        offset: (currPage - 1) * pageSize,
        limit: pageSize
      }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
    if (currPage > Math.ceil(count / pageSize)) {
      req.flash('error_messages', '頁面不存在')
      return res.redirect('/admin/categories')
    }
    const pages = Array.from({ length: Math.ceil(count / pageSize) }, (_, i) => Number(i + 1))
    const categories = rows.map(({ dataValues }) => dataValues)
    const nextPage = currPage === pages.length ? 0 : currPage + 1
    const prevPage = currPage - 1
    return res.render('admin/categories', { categories, category, pages, nextPage, prevPage, currPage })
  } catch (err) {
    next(err)
  }
}

exports.postCategory = async (req, res, next) => {
  try {
    const { name } = req.body
    if (!name) throw new Error('請輸入名稱')
    const findCategories = await Category.findOne({where: { name }})
    if (findCategories) {
      throw new Error('類別已存在')
    }
    const newCategory = new Category({ name })
    await newCategory.save()
    req.flash('success_messages','新增類別成功')
    return res.redirect('/admin/categories')

  } catch (err) {
    next(err)
  }
}

exports.putCategory = async (req, res, next) => {
  try {
    const { name } = req.body
    const { id } = req.params
    if (!name) throw new Error('請輸入名稱')

    const category =  await Category.findByPk(id)
    if (!category) throw new Error('找不到此類別')
    await category.update({ name })
    req.flash('success_messages','新增類別成功')
    return res.redirect('/admin/categories')

  } catch (err) {
    next(err)
  }
}

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) throw new Error('需要 id')
    const category = await Category.findByPk(id)
    if (!category) throw new Error('找不到此類別')

    await category.destroy()
    return res.redirect('/admin/categories')
  } catch (err) {
    next(err)
  }
}