const { Restaurant } = require('../models')
// const { localFileHandler } = require('../helpers/file-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
    const { name, tel, address, openingHours, description } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Restaurant name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file
    return imgurFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      .then(filePath => Restaurant.create({ // 再 create 這筆餐廳資料，產生一個新的 Restaurant 物件實例，並存入資料庫
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
        // image: filePath || null 的意思是：如果 filePath 的值為檔案路徑字串(使用者有上傳檔案，就會被判斷為 Truthy)，就將 image 的值設為檔案路徑；如果 filePath 的值是空的(也就是沒有上傳檔案，因此沒有檔案路徑，會被判斷為 Falsy)，那麼就將 image 的值設為 null
      }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants') // 存完之後，回首頁
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
    const { file } = req // 把檔案取出來
    Promise.all([ // 非同步處理
      Restaurant.findByPk(req.params.id), // 去資料庫查有沒有這間餐廳
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([restaurant, filePath]) => { // 以上兩樣事都做完以後
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({ // 修改這筆資料
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
    // 沒有設定 { raw: true } 來整理成乾淨的資料，這是因為這邊會需要用到 restaurant.update 這個方法，如果加上參數就會把 sequelize 提供的這個方法過濾掉，會無法使用。因此在編輯情境裡我們是不會加 { raw: true } 的
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
