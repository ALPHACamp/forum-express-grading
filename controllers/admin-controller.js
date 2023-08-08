/*
req.query
  是瀏覽器網址?後方的字串，常用來自作搜尋功能
req.body
  是瀏覽器經由post方法傳過來的資料，可以做進一步的資料處理
req.params
  是動態路由的設計，如/users/:id，使用req.params.id可以取得動態路由的'字串'，常用於製作個別頁面或個別資料操作
*/

// 在Sequeize中，已經匯入及配置好所有的模型(Model)和關聯，所以在載入Model的時候不必單獨載入，這是與mongoose不同的地方
const { Restaurant, User, Category } = require('../models/index')
const { imgurFileHandler } = require('../helpers/file-helpers')
const adminController = {

  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })

      .then(restaurants => res.render('admin/restaurants', { restaurants }))

      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Restaurant name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示

    const { file } = req
    return imgurFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      .then(filePath => Restaurant.create({ // 再 create 這筆餐廳資料
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { // 去資料庫用 id 找一筆資料
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
    return Restaurant.findByPk(req.params.id, {
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
    return Promise.all([ // 非同步處理
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
  },
  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  // 使用者權限管理
  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => res.render('admin/users', { users }))

      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    let errorRoot = false
    // 查找此id
    return User.findByPk(req.params.id)
      .then(user => {
        // 如果沒有user，直接return
        if (!user) throw new Error("User didn't exist!")
        if (user.email === 'root@example.com') {
          errorRoot = true
          return req.flash('error_messages', '禁止變更 root 權限')
        }
        req.flash('success_messages', '使用者權限變更成功')
        return user.update({
        // 如果user.isAdmin 為true，將其改變為false，如果為false，將其改變為true
          isAdmin: !user.isAdmin
        })
      })
      .then(() => {
        if (errorRoot) res.redirect('back')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }

}

module.exports = adminController
