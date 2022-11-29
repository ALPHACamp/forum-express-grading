// 後台

// 導入model
const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const adminController = {
  getRestaurants: (req, res, next) => {
    // 渲染所有餐廳
    Restaurant.findAll({
      raw: true,
      nest: true, // 與raw類似，轉成JS原生物件。主要是因為include為[]回傳，會多包一層，所以才要再加nest
      include: [Category]// 當你想要使用 model 的關聯資料時，需要透過 include 把關聯資料拉進來，關聯資料才會被拿到 findAll 的回傳值裡。
    })
      // 不使用raw:true，會回傳sequelize的instance。在沒有要用Sequelize做後續操作時，可以轉成JS原生物件。
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  // 渲染新增頁面
  createRestaurant: (req, res, next) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },
  // post
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    // 檢測是否有輸入餐廳名稱
    if (!name) throw new Error('Restaurant name is required!')
    // 取出圖片
    const { file } = req
    imgurFileHandler(file)
      .then(filePath => Restaurant.create({
        name, tel, address, openingHours, description, image: filePath || null, categoryId
        // 圖片路徑載入，有或者沒有檔案。image: filePath || null 的意思是：如果 filePath 的值為檔案路徑字串 (使用者有上傳檔案，就會被判斷為 Truthy)，就將 image 的值設為檔案路徑；如果 filePath 的值是空的 (也就是沒有上傳檔案，因此沒有檔案路徑，會被判斷為 Falsy)，那麼就將 image 的值設為 null。
      }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  // 單一筆餐廳
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.rest_id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        // 如果找不到餐廳
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  // edit
  editRestaurant: (req, res, next) => {
    return Promise.all([Restaurant.findByPk(req.params.rest_id, { raw: true }), Category.findAll({ raw: true })])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  // 編輯餐廳
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    // 這裡不用raw是因為，待會更新會需要資料庫操作。
    const { file } = req
    // 使用promise.all確保兩者皆執行完
    Promise.all([Restaurant.findByPk(req.params.rest_id), imgurFileHandler(file)])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 使用return避免蜂巢
        return restaurant.update({
          name, tel, address, openingHours, description, image: filePath || restaurant.image, categoryId
          // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  deleteRestaurant: (req, res, next) => {
    // 這裡為什麼要return?
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  // get users
  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => res.render('admin/users', { users }))
      .catch(err => next(err))
  },
  // 修改使用者權限
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('User does not exist!')
        if (user.name === 'admin') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')// request headers referer，不使用使用者權限將被更改
        }
        return user.update({ isAdmin: !user.isAdmin })
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
  // delete user
  // !user
  // user!==root
  // user !==admin
  // 全部類別
}
module.exports = adminController
