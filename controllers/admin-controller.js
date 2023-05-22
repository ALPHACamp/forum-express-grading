const { Restaurant, User, Category } = require('../models')
// const { localFileHandler } = require('../helpers/file-helpers') // 將 file-helper 載進來
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      // nest: true 可以讓從資料庫拿回來的東西整齊一點
      nest: true,
      // 想要使用 model 的關聯資料時，需要透過 include 把關聯資料拉進來，關聯資料才會被拿到 findAll 的回傳值裡。
      include: [Category]
    })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants: restaurants })
      })
  },
  createRestaurant: (req, res, next) => {
    // 把Category table 裡面的所有資料，傳到 create-restaurant.hbs 裡面，這樣才有全部類別可以選
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => {
    // 從 req.body 拿出表單裡的資料
    const { name, tel, address, openingHours, description, categoryId } = req.body
    // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file
    return imgurFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      .then(filePath =>
        Restaurant.create({ // 產生一個新的 Restaurant 物件實例，並存入資料庫
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null,
          categoryId
        }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { // Pk 是 primary key 的簡寫，也就是餐廳的 id，去資料庫用 id 找一筆資料
      raw: true, // 找到以後整理格式再回傳
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    // 編輯情境時，需要同時去「查詢 Restaurants table」 和「查詢 Categories table」，但這兩件事沒有先後順序，不需要互相等待，因此我們就可以用 Promise.all() 裡面的陣列，把這兩個程序都裝進去。
    return Promise.all([
      // 先使用 findByPk ，檢查一下有沒有這間餐廳
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        // 如果沒有的話，直接拋出錯誤訊息。
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 有的話，就前往 admin/edit-restaurant
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    // 將 req.body 中傳入的資料用解構賦值的方法存起來
    const { name, tel, address, openingHours, description, categoryId } = req.body
    // 檢查必填欄位 name 有資料
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req // 把檔案取出來
    return Promise.all([ // 非同步處理
    // 透過 Restaurant.findByPk(req.params.id) 把對應的該筆餐廳資料查出來
      Restaurant.findByPk(req.params.id),
      // 編輯情境裡不會加 { raw: true }
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([restaurant, filePath]) => { // 以上兩樣事都做完以後
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 如果有成功查到，就透過 restaurant.update 來更新資料。
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
          categoryId
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
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true,
      nest: true
    })
      .then(users => res.render('admin/users', { users: users }))
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        return user.update({ isAdmin: !user.isAdmin })
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
