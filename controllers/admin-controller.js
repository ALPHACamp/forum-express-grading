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
  },
  // 單一筆餐廳
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.rest_id, { raw: true })
      .then(restaurant => {
        // 如果找不到餐廳
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  // edit
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.rest_id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  // 編輯餐廳
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    // 這裡不用raw是因為，待會更新會需要資料庫操作。
    Restaurant.findByPk(req.params.rest_id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 使用return避免蜂巢
        return restaurant.update({
          name, tel, address, openingHours, description
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
