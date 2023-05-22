const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers') // 將 file-helper 載進來

const adminController = {
  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true, // 讓拿到的資料是最簡單的javascript資料
      nest: true, // 讓拿到的資料是比較簡單的. ex:restaurant.category.id
      include: [Category] // 把Category的sequelize也引進來
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHour, description, categoryId } = req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Restaurant name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示
    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file
    imgurFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      .then(filePath => Restaurant.create({ // 產生一個新的 Restaurant 物件實例，並存入資料庫
        name,
        tel,
        address,
        openingHour,
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
    Restaurant.findByPk(req.params.id, { // 去資料庫用 id 找一筆資料
      include: [Category]
    })
      .then(restaurant => { // 此時撈出的資料仍是sequelize的原生格式
        if (!restaurant) throw new Error("Restaurant didn't exist!") // 如果找不到，回傳錯誤訊息，後面不執行
        res.render('admin/restaurant', { restaurant: restaurant.toJSON() }) // 所以也可以用toJSON()去解析，但只有找單筆資料時可以用此方法
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => { // 新增這段
    return Promise.all([ // 此兩種非同步事件並無先後，只要找完資料後執行即可
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // categories.forEach(item => {
        //   if (restaurant.categoryId === item.id) {
        //     item.newId = true
        //   }
        // })
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHour, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req // 把檔案取出來
    Promise.all([ // 非同步處理
      Restaurant.findByPk(req.params.id), // 去資料庫查有沒有這間餐廳
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHour,
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
  deleteRestaurant: (req, res, next) => { // 新增以下
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true // 讓拿到的資料是最簡單的javascript資料
    })
      .then(users => {
        users.forEach(element => {
          if (element.isAdmin === 1) {
            element.isAdmin = 'admin'
            element.fixAdmin = 'save as user'
          } else {
            element.isAdmin = 'user'
            element.fixAdmin = 'save as admin'
          }
        })
        return users
      })
      .then(users => res.render('admin/all-users-authority', { users }))
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!") // 沒有資料就拋錯
        if (user.email === 'root@example.com') { // 若email = root@example.com則提示錯誤
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        user.update({ // 只要email不是root@example.com, 就admin和user身分對換
          isAdmin: !user.isAdmin
        })
        req.flash('success_messages', '使用者權限變更成功')
        return res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
