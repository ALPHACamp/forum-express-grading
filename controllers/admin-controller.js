const { Restaurant } = require('../models')
const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    // 從 req.body 拿出表單裡的資料
    const { name, tel, address, openingHours, description } = req.body
    // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    if (!name) throw new Error('Restaurant name is required!')
    // 產生一個新的 Restaurant 物件實例，並存入資料庫
    Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description
    })
      .then(() => {
        // 在畫面顯示成功提示
        req.flash('success_messages', 'restaurant was successfully created')
        // 新增完成後導回後台首頁
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
