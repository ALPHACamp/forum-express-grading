const { Restaurant, User, Category } = require('../models')
// 加入 user model

const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  // 渲染所有餐廳
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true,
      // 把 sequelize 包裝過的物件 instance 轉換成 JS 原生物件, 不再可使用 .save() 等方法，同 toJSON()
      nest: true,
      // 把 'Category.name':'素食料理' 變成 Category:{name:'素食料理'}
      include: [Category] // 關聯資料
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  // 讀取使用者功能
  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => {
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },
  // 修改使用者功能
  patchUser: (req, res, next) => {
    // console.log(req.params.id)
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error(" User didn't exsit!")

        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        } else {
          return user.update({ isAdmin: !user.isAdmin })
        }
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        return res.redirect('/admin/users')
      })
      .catch(err => {
        return next(err)
      })
  },
  // 渲染新增表單
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  // 提交新增表單
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    // 把檔案取出來，也可以寫成 const file = req.file
    const { file } = req
    // 把取出的檔案傳給 file-helper 處理
    imgurFileHandler(file)
      .then(filePath =>
        Restaurant.create({
          // 再 create 這筆餐廳資料
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null
          // 如果 filePath 的值為檔案路徑字串 (使用者有上傳檔案，就會被判斷為 Truthy)，就將 image 的值設為檔案路徑；如果 filePath 的值是空的 (也就是沒有上傳檔案，因此沒有檔案路徑，會被判斷為 Falsy)，那麼就將 image 的值設為 null
        })
      )
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
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
  // 提交修改資料
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    // 把檔案取出來
    const { file } = req
    Promise.all([
      // 非同步處理
      Restaurant.findByPk(req.params.id), // 去資料庫查有沒有這間餐廳
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([restaurant, filePath]) => {
        // 以上兩樣事都做完以後
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          // 修改這筆資料
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
  },
  // 刪除
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
