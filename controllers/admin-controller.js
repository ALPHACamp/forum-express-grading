const { Restaurant, User, Category } = require('../models')
// 上面是解構賦值的寫法，等於下面這種寫法的簡寫
// const db = require('../models')
// const Restaurant = db.Restaurant
const { imgurFileHandler } = require('../helpers/file-helpers') // // 將 file-helper 載進來

const adminController = {
  // 瀏覽全部餐廳頁面
  getRestaurants: (req, res, next) => {
    // 先去資料庫撈全部的餐廳資料
    Restaurant.findAll({
      raw: true, // 使用raw: true整理資料，把資料變成單純js的JSON格式物件，如此收到回傳的資料以後，就可以直接把資料放到樣板裡面了
      nest: true, // 把資料整理成比較容易取用的結構
      include: [Category] // 使用 Category model 的關聯資料
    })
    // 撈完資料，再渲染畫面
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  // 新增餐廳表單頁面
  createRestaurant: (req, res, next) => {
    // 先去撈 Category table 裡面的所有資料
    return Category.findAll({
      raw: true
    })
    // 把撈到的categories資料傳到 create-restaurant.hbs
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },
  // 新增餐廳資料給db
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    // 後端驗證，確保必有input name="name"這個資料
    if (!name) throw new Error('Restaurant name is required!')

    const file = req.file // 把檔案取出來，也可以寫成 const { file } = req
    return imgurFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      .then(filePath => // 再 create 這筆餐廳資料
        Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null,
          // 如果 filePath 的值為檔案路徑字串 (使用者有上傳檔案，就會被判斷為 Truthy)，就將 image 的值設為檔案路徑；如果 filePath 的值是空的 (也就是沒有上傳檔案，因此沒有檔案路徑，會被判斷為 Falsy)，那麼就將 image 的值設為 null
          categoryId
        }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },
  // 瀏覽1間餐廳頁面
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, // 對應到路由傳過來的參數，用此參數去資料庫用 id 找一筆資料
      {
        raw: true, // 找到以後整理格式成單純的js物件再回傳
        nest: true,
        include: [Category]
      })
      .then(restaurant => {
        if (!restaurant) throw new Error('這間餐廳不存在!') //  如果找不到，回傳錯誤訊息，後面不執行
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => next(err))
  },
  // 編輯1間餐廳表單頁面
  editRestaurant: (req, res, next) => {
    // 用 Promise.all() 裡面的陣列，把這兩個非同步事件的程序都裝進去。查詢都回來以後，才會進入後面的 .then 把資料傳給樣板
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error('這間餐廳不存在!')
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    // 因為這邊會需要用到 restaurant.update 這個方法，如果加上參數就會把 sequelize 提供的這個方法過濾掉，會無法使用。因此在編輯情境裡我們是不會加 { raw: true } 的。
    const file = req.file
    Promise.all([ // 用promise.all 處理非同步事件
      Restaurant.findByPk(req.params.id), // 去資料庫查有沒有這間餐廳
      imgurFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([restaurant, filePath]) => { // 以上兩樣事都做完以後
        if (!restaurant) throw new Error('這間餐廳不存在!')
        // 注意!!這邊加 return 可以把這段return裡的程式碼執行結果直接帶到下個then前面，這樣是為了避免太多巢狀程式碼，使的不好閱讀跟維護，但因為是剛好下個then不會需要用到return內的值才可以這樣寫，如果要的話，還是必須寫成下面的方式，把then接在後面
        // restaurant.update({
        //   name,
        //   tel,
        //   address,
        //   openingHours,
        //   description
        // }).then(() => {})
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
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
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error('這間餐廳不存在!') // *******避免找不到餐廳而導致程式出錯，還是需要加一個判斷排除錯誤
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true
      // nest: true
    })
      .then(users => {
        res.render('admin/users', { users })
      })
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('這位使用者不存在!')
        // 用email去判斷，如果抓到的user是 root@example.com 就無法更動權限
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          res.redirect('back')
        }
        return user.update({ isAdmin: !user.isAdmin }) // 用!user.isAdmin去切換isAdmin的true or false
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
