// 引入model
const { Restaurant } = require('../models')

const adminController = {
  // 瀏覽後台網頁
  getRestaurants: (req, res, next) => {
    // 查詢Restaurant所有資料
    Restaurant.findAll({
      // 去除sequelize物件實例
      raw: true
    })
      // 渲染admin/restaurants畫面
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },

  // 渲染新增餐廳頁面
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },

  // 新增餐廳路由
  postRestaurant: (req, res, next) => {
    // 取得表單資料
    const { name, tel, address, description, openingHours } = req.body

    // 判斷name欄位是否有值，若無則丟出Error物件
    if (!name) throw new Error('Restaurant name is required')

    // 判斷name有值後，新增資料至資料庫
    Restaurant.create({
      name,
      tel,
      address,
      description,
      openingHours
    })
      .then(() => {
        // 回傳成功訊息，並導向admin/restaurants
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}

// 匯出模組
module.exports = adminController
