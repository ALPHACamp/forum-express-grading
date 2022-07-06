// 載入 model 寫法1：
// const db = require('../models')
// const Restaurant = db.Restaurant

// 載入 model 寫法2：
const { Restaurant } = require('../models')

// 建立一個名為 adminController 的object
// adminController object 中有一個方法叫做 getRestaurants，負責「瀏覽餐廳頁面」，也就是去 render 名為 restaurants 的hbs

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true }) // 用findAll在sequelize找到的是物件(實體)，所以要用raw:true 去把撈到的資料轉換成簡單的js物件
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
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
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
