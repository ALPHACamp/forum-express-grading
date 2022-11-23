// 後台

// 導入model
const { Restaurant } = require('../models')

const adminController = {
  getRestaurants: (req, res, next) => {
    // 渲染所有餐廳
    Restaurant.findAll({ raw: true })
      // 不使用raw:true，會回傳sequelize的instance。在沒有要用Sequelize做後續操作時，可以轉成JS原生物件。
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  // 渲染新增頁面
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  // post
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    // 檢測是否有輸入餐廳名稱
    if (!name) throw new Error('Restaurant name is required!')
    Restaurant.create({
      name, tel, address, openingHours, description
    })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
