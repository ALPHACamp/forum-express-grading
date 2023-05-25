const { Restaurant, User, Category } = require('../models') // 帶入database
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  // 所有餐廳頁面
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ // 抓取所有 Restaurant 資料
      raw: true, // 簡化資料，類.lean()
      nest: true, // 把 categoryId: 5 'Category.name: OOO' 資料調整成 this.Category.name 資料
      include: [Category] // 帶入關聯資料
    })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants: restaurants })
      })
  },
  // 新增餐廳頁面
  createRestaurant: (req, res, next) => {
    return Category.findAll({ // 抓取Category資訊
      raw: true
    })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Restaurant name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file
    imgurFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      .then(filePath => Restaurant.create({ // 再 create 這筆餐廳資料
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null, // 如果有就新增不然就null
        categoryId
      }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  },
  // 餐廳詳情頁面
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { // MySQL 語法 findByPK 找資料id(主鍵)，req.params.id 抓網址:id
      raw: true, // 找到以後整理格式再回傳
      nest: true, // 把 categoryId: 5 'Category.name: OOO' 資料調整成 this.Category.name 資料
      include: [Category] // 帶入關聯資料
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  // 修改餐廳詳情頁面
  editRestaurant: (req, res, next) => {
    return Promise.all([ // 2項非同步可同步執行，故使用promise
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => { // 兩個都執行完成後依序帶入結果
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  // 修改餐廳請求
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req // 把檔案取出來
    Promise.all([ // 非同步處理
      Restaurant.findByPk(req.params.id), // 去資料庫查有沒有這間餐廳，不用 raw 因為會需要用到 restaurant.update，如果加上參數就會把 sequelize 提供的這個方法過濾掉，會無法使用
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([restaurant, filePath]) => { // 以上兩樣事都做完以後
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({ // sequelize 編輯資料語法
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image, // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值 
          categoryId
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  // 刪除資料
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id) // 不用raw使用destroy()功能
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy() // sequelize 刪除資料功能
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  // Users頁面
  getUsers: (req, res) => {
    return User.findAll({
      raw: true
    })
      .then(users => {
        return res.render('admin/users', { users: users })
      })
  },
  // Users修改權限
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(User => {
        if (!User) throw new Error("User didn't exist!")
        if (User.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          res.redirect('back')
        } else {
          req.flash('success_messages', '使用者權限變更成功')
          res.redirect('/admin/users')
          return User.update({ isAdmin: !User.isAdmin })
        }
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
