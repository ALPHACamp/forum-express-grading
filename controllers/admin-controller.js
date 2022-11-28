// const db=require('../models')
// const Restaurant=db.Restaurant
const { Restaurant, User, Category } = require('../models')
const {
  localFileHandler,
  imgurFileHandler
} = require('../helpers/file-helpers')
const superUser = { name: 'root', email: 'root@example.com' } // 建議獨立出來

const adminController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true, // 把 Sequelize 包裝過的一大包物件轉換成格式比較單純的 JS 原生物件
      nest: true, // 預設下，Sequelize只返回本身資料，不包含關聯資料，所以用nest整理關聯資料
      include: [Category] // 透過 include 把關聯資料拉進來
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },
  createRestaurant: (req, res) => {
    return Category.findAll({ raw: true })
      .then(categories =>
        res.render('admin/create-restaurant', { categories })
      )
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } =
      req.body // 從 req.body 拿出表單裡的資料
    if (!name) throw new Error('Restaurant name is required!') // name 是必填，若發先是空值就會終止程式碼，並在畫面顯示錯誤提示。即使前端有required，但前後端分離，後端必須自己也要控管。throw 讓我們可以在程式出錯時，終止執行此區塊的程式碼，並拋出客製化的錯誤訊息。

    const file = req.file // 把檔案取出來
    return imgurFileHandler(file) // 把取出的檔案傳給 file-helper 處理後。要用本地的話改成 localFileHandler這詞就好，下面put亦同
      .then(filePath =>
        Restaurant.create({
          // 產生一個新的 Restaurant 物件實例，並存入資料庫
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null,
          categoryId
        })
      )
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created!') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.rest_id, {
      // 去資料庫用 id(PK) 找一筆資料
      raw: true, // 換成格式比較單純的 JS 原生物件
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        res.render('admin/restaurant', { restaurant }) // 只抓單筆時，可不用raw,nest，改用restaurant:restaurant.toJSON()
      })
      .catch(err => next(err))
  },
  editRestaurant: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ]) // 裝著非同步事件的陣列，產出依序對應的結果於then使用
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    // 用Sequelize的物件才有update語法，raw則沒
    const { name, tel, address, openingHours, description, categoryId } =
      req.body
    if (!name) throw new Error('Restaurant name is required!')
    const file = req.file
    // Promise.all裝滿著promise物件的陣列，所以加個中括號吧 //雖然沒中括號好像也行(?)
    Promise.all([Restaurant.findByPk(req.params.id), imgurFileHandler(file)]) // 確認做完這兩件事後才then
      // 有沒這間餐廳、把檔案傳到 file-helper 處理完
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours, // 根據models所寫的，而不是sql資料庫的
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
    // 刪除時也不用raw
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => res.render('admin/users', { users }))
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.email === superUser.email) {
          req.flash('error_messages', '禁止變更 ${superUser.name} 權限')
          return res.redirect('back')
        }
        return user.update({ isAdmin: !user.isAdmin }) // 處理boolean
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
