const { Restaurant } = require('../models')

const adminController = {
  // 渲染所有餐廳
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true // 把 instance 轉成 javascript 物件
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  // 渲染新增表單
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  // 提交新增表單
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Restaurant name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    Restaurant.create({
      // 產生一個新的 Restaurant 物件實例，並存入資料庫
      name,
      tel,
      address,
      openingHours,
      description
    })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
