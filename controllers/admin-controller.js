const { Restaurant } = require('../models') // 新增這裡

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  }, // 補逗點
  // 新增這個
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  // 新增以下
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Restaurant name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
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
  // getRestaurant 而不是 getRestaurants，代表要 show specific restaurant
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { // 去資料庫用 id 找一筆資料
      raw: true // 找到以後整理格式再回傳
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
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
    // 拿資料、更新資料、閃flash、回restaurants清單
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          // 沒有設定 { raw: true } 來整理成乾淨的資料，這是因為這邊會需要用到 restaurant.update 這個方法，如果加上參數就會把 sequelize 提供的這個方法過濾掉，會無法使用。因此在編輯情境裡我們是不會加 { raw: true } 的
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
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
        // 刪除的時候也不會加 { raw: true } 參數
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }
}
module.exports = adminController
