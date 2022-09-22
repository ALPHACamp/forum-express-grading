const { Restaurant, User, Category } = require('../models') // === require('../models/index')

// const { localFileHandler } = require('../helpers/file-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ // [{}, {}]
      raw: true, // 轉成單純 JS 物件，不轉也可以但要在.dataValues 取值
      nest: true, // 變成巢狀( key-value )
      include: [Category] // 這邊指的是在 model 用 include 將關聯資料拉進來 findAll 的準備回傳值
    })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
      })
      .catch(error => next(error))
  },
  createRestaurant: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(error => next(error))
  },
  postRestaurant: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    imgurFileHandler(req.file)
      .then(filePath => {
        req.body.image = filePath || null // 有要上傳檔案 || 沒有要上傳檔案
        return Restaurant.create({ ...req.body })
      })
      .then(() => {
        req.flash('success_messages', '餐廳新增成功!')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")

        res.render('admin/restaurant', { restaurant })
      }).catch(error => next(error)) // 不知道會有什麼錯誤會產生，所以只要有錯誤就將錯誤往 middleware/error-handler.js 丟
  },
  editRestaurant: (req, res, next) => {
    Promise.all([
      Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")

        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(error => next(error))
  },
  putRestaurant: (req, res, next) => {
    if (!req.body.name) throw new Error('Restaurant name is required!')

    Promise.all([
      Restaurant.findByPk(req.params.id),
      imgurFileHandler(req.file)
    ])
    // 下面還是針對資料表資料做處理，所以不用轉成 JS 物件
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")
        req.body.image = filePath || restaurant.image // 後來新圖片的檔案位置 || 沒有新圖片所以是資料庫舊圖片路徑
        return restaurant.update({ ...req.body }) // 注意這邊，是針對該筆資料做 update 不是對資料表
      })
      .then(() => {
        req.flash('success_messages', 'Restaurant was successfully to update!')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  },
  deleteRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")

        return restaurant.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Delete successfully')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true,
      nest: true
    })
      .then(users => {
        users.forEach(user => {
          user.role = user.isAdmin ? 'admin' : 'user'
        })
        res.render('admin/users', { users })// isAdmin -> number
      })
      .catch(error => next(error))
  },
  patchUser: (req, res, next) => {
    const id = req.params.id
    return User.findByPk(id)
      .then(user => {
        if (!user) throw new Error("Users isn't exist!")
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }

        return user.update({ isAdmin: !user.dataValues.isAdmin })
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      })
      .catch(error => next(error))
  },
  getCategories: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      Category.findByPk(id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([category, categories]) => {
        res.render('admin/categories', { category, categories })
      })
      .catch(error => next(error))
  },
  postCategories: (req, res, next) => {
    const { categoryName } = req.body
    Category.findOne({ where: { name: categoryName.trim() } })
      .then(category => {
        if (category) throw new Error(`${category.name} 已經建立了`)

        return Category.create({ name: categoryName })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(error => next(error))
  },
  putCategory: (req, res, next) => {
    const id = req.params.id
    const { categoryName } = req.body

    Category.findByPk(id) // 這邊要注意不用轉換
      .then(category => {
        if (!category) throw new Error("Category isn't exist!")

        category.update({ name: categoryName })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(error => next(error))
  },
  deleteCategory: (req, res, next) => {
    const id = req.params.id

    Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error("Category isn't exist!")

        return category.destroy()
      })
      .then(() => {
        req.flash('success_messages', '刪除成功!')
        res.redirect('/admin/categories')
      })
      .catch(error => next(error))
  }
}

module.exports = adminController
