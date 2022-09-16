const { Restaurant } = require('../models') // === require('../models/index')

const { localFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ // [{}, {}]
      raw: true // 轉成單純 JS 物件，不轉也可以但要在.dataValues 取值
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(error => next(error))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    localFileHandler(req.file)
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
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")

        res.render('admin/restaurant', { restaurant })
      }).catch(error => next(error)) // 不知道會有什麼錯誤會產生，所以只要有錯誤就將錯誤往 middleware/error-handler.js 丟
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant isn't exist!")

        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(error => next(error))
  },
  patchRestaurant: (req, res, next) => {
    if (!req.body.name) throw new Error('Restaurant name is required!')

    Promise.all([
      Restaurant.findByPk(req.params.id),
      localFileHandler(req.file)
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
        req.flash('success_message', 'Delete successfully')
        res.redirect('/admin/restaurants')
      })
      .catch(error => next(error))
  }
}

module.exports = adminController
