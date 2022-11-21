const { Restaurant } = require('../models')
// 上面是解構賦值的寫法，等於下面這種寫法的簡寫
// const db = require('../models')
// const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res, next) => {
    // 先去資料庫撈全部的餐廳資料
    Restaurant.findAll({
      raw: true // 使用raw: true整理資料，把資料變成單純js的JSON格式物件，如此收到回傳的資料以後，就可以直接把資料放到樣板裡面了
    })
    // 撈完資料，再渲染畫面
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body

    // 後端驗證，確保必有input name="name"這個資料
    if (!name) throw new Error('Restaurant name is required!')

    Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description
    })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
