const db = require('../models')
const { Restaurant } = db
const { localFileHandler } = require('../helpers/file-helpers')
const adminController = {
  //* 讀取全部
  getRestaurants: (req, res) => {
    Restaurant.findAll({
      raw: true
    })

      .then(restaurants => res.render('admin/restaurants', { restaurants }))

      .catch(err => next(err))
  },
  //* 新增餐廳
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    //* 從 req.body 拿出表單裡的資料
    const { name, tel, address, openingHours, description } = req.body
    //* name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    localFileHandler(file)
      .then(filePath =>
        Restaurant.create({
          //* 產生一個新的 Restaurant 物件實例，並存入資料庫
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null
        })
      )
      .then(() => {
        //* 在畫面顯示成功提示
        req.flash('success_messages', 'restaurant was successfully created')
        //* 新增完成後導回後台首頁
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  //* 讀取餐廳詳細
  getRestaurant: (req, res, next) => {
    // 去資料庫用 id 找一筆資料
    Restaurant.findByPk(req.params.id, {
      // 找到以後整理格式再回傳
      raw: true
    })
      .then(restaurant => {
        //  如果找不到，回傳錯誤訊息，後面不執行
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  //* 編輯餐廳資訊
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    Promise.all([Restaurant.findByPk(req.params.id), localFileHandler(file)])
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          // 有新上傳用新的，沒有就用舊的(舊的可能是NULL)
          image: filePath || restaurant.image
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  //* 刪除餐廳
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }
}

module.exports = adminController
