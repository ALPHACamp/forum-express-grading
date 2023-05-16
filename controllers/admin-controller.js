const { Restaurant } = require('../models')
const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true
    })
      .then(restaurants => {
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
    Restaurant.create({ // 產生一個新的 Restaurant 物件實例，並存入資料庫
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
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { // Pk 是 primary key 的簡寫，也就是餐廳的 id，去資料庫用 id 找一筆資料
      raw: true // 找到以後整理格式再回傳
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    // 先使用 findByPk ，檢查一下有沒有這間餐廳
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        // 如果沒有的話，直接拋出錯誤訊息。
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 有的話，就前往 admin/edit-restaurant
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    // 將 req.body 中傳入的資料用解構賦值的方法存起來
    const { name, tel, address, openingHours, description } = req.body
    // 檢查必填欄位 name 有資料
    if (!name) throw new Error('Restaurant name is required!')
    // 透過 Restaurant.findByPk(req.params.id) 把對應的該筆餐廳資料查出來
    Restaurant.findByPk(req.params.id)
    // 編輯情境裡不會加 { raw: true }
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 如果有成功查到，就透過 restaurant.update 來更新資料。
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => { 
    // 先 findByPk ，找找看有沒有這間餐廳。
    return Restaurant.findByPk(req.params.id)
    // 刪除的時候也不會加 { raw: true } 參數
      .then(restaurant => {
        // 沒找到就拋出錯誤並結束
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 有就呼叫 sequelize 提供的 destroy() 方法來刪除這筆資料
        return restaurant.destroy()
      })
      // 呼叫完沒問題的話，就回到後台首頁
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }
}
module.exports = adminController
