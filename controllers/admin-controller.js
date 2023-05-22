const { Restaurant } = require('../models') // 帶入database

const adminController = {

  // 所有餐廳頁面
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ // 抓取所有 Restaurant 資料
      raw: true // 簡化資料，類.lean()
    })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants: restaurants })
      })
  },

  // 新增餐廳頁面
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
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

  // 餐廳詳情頁面
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { // MySQL 語法 findByPK 找資料id(主鍵)，req.params.id 抓網址:id
      raw: true // 找到以後整理格式再回傳
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  // 修改餐廳詳情頁面
  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant }) // hbs內的 restaurant 帶入 restaurant
      })
      .catch(err => next(err))
  },
  // 修改餐廳請求
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    Restaurant.findByPk(req.params.id) // 不用 raw 因為會需要用到 restaurant.update，如果加上參數就會把 sequelize 提供的這個方法過濾掉，會無法使用
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({ // sequelize 編輯資料語法
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
  }
}
module.exports = adminController
