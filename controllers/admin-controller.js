const { Restaurant } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true // 把 Sequelize 包裝過的一大包物件轉換成格式比較單純的 JS 原生物件，再把資料傳到 view 裡
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Restaurant name is required!') // name 是必填，若發先是空值就會終止此區塊的程式碼，並在畫面顯示錯誤提示。這是 throw 關鍵字的效果。
    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file
    localFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      .then(filePath => {
        Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null // 如果 filePath 的值為檔案路徑字串 (使用者有上傳檔案，就會被判斷為 Truthy)，就將 image 的值設為檔案路徑；如果 filePath 的值是空的 (也就是沒有上傳檔案，因此沒有檔案路徑，會被判斷為 Fasly)，那麼就將 image 的值設為 null。
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { // 去資料庫用 id 找一筆資料
      raw: true // 把從資料庫傳來的資料轉換成 JS 原生物件
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
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req // 把檔案取出來
    Promise.all([ // 非同步處理
      Restaurant.findByPk(req.params.id), // 去資料庫查有沒有這間餐廳 沒有設定 { raw: true } 來整理成乾淨的資料，因為這邊會用到 restaurant.update 這個方法，如果加上參數會把 sequelize 提供的方法過濾掉，無法使用
      localFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image
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
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  }
}

module.exports = adminController
