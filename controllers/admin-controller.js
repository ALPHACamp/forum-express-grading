// const db = require('../models')
// const Restaurant = db.Restaurant
// 完全上面兩行相等
const { Restaurant } = require('../models')
// const { localFileHandler } = require('../helpers/file-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  // 修改這裡
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Restaurant name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    const { file } = req
    imgurFileHandler(file)
      // localFileHandler(file)
      .then(filePath => {
        return Restaurant.create({
          // 產生一個新的 Restaurant 物件實例，並存入資料庫
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant did'nt exists !")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant did'nt exists !")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    const { file } = req
    Promise.all([imgurFileHandler(file), Restaurant.findByPk(req.params.id)])
      // Promise.all([localFileHandler(file), Restaurant.findByPk(req.params.id)]) // 内部 promise 沒有相關聯，可以以此方式做 Promise.all
      // Restaurant.findByPk(req.params.id)
      .then(([filePath, restaurant]) => {
        if (!restaurant) throw new Error("Restaurant did'nt exists !")
        return restaurant.update({
          // 這裏直接操作 restaurant，所以不需要用 Restaurant.update({where:{}})
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image // 因爲是已有的餐廳，所以如果使用者沒有上傳新的圖片就用舊的
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant did'nt exists !")
        return restaurant.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to delete')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
