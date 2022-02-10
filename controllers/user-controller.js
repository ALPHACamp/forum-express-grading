// 引入模組
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like } = db

// 引入file-helpers
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  // 渲染signup頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    // 若password與passwordCheck不一致，建立一個Error物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        // 確認資料庫是否有一樣的email，若有建立一個Error物件並拋出
        if (user) throw new Error('Email already exists!')

        // 若無建立密碼雜湊，並將資料新增至資料庫，最後重新導向signin頁面
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號') // 顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },

  // 渲染signin頁面
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },

  // 登出路由
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },

  // 瀏覽profile
  getUser: (req, res, next) => {
    // 取得動態路由id
    const id = Number(req.params.id)
    // 取得使用者id
    // const userId = req.user.id

    return Promise.all([
      User.findByPk(id, { raw: true }), // 查詢動態路由id的user資料
      Comment.findAndCountAll({ // 查詢使用者的評論資料
        include: Restaurant,
        where: { userId: id },
        raw: true,
        nest: true
      })
    ])
      .then(([user, comment]) => {
        // 判斷是否有該資料，否回傳錯誤訊息
        if (!user) throw new Error("User didn't exists!")

        // 渲染users/profile頁面，並帶入參數
        return res.render('users/profile', { user, comment: comment.rows, commentCounts: comment.count })
      })
      .catch(err => next(err))
  },

  // 編輯profile頁面
  editUser: (req, res, next) => {
    // 取得登入者id
    // const userId = req.user.id
    // 取得動態路由id
    const id = Number(req.params.id)

    // 判斷前往路由id是否與userId一致，否回傳錯誤訊息
    // if (id !== userId) throw new Error('只能瀏覽自已的Profile')

    // 查詢動態路由id的user資料
    return User.findByPk(id, { raw: true })
      .then(user => {
        // 判斷是否有該資料，否回傳錯誤訊息
        if (!user) throw new Error("User didn't exists!")

        // 渲染users/profile頁面，並帶入參數
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },

  // 更新profile
  putUser: (req, res, next) => {
    console.log('name', req)
    // 取得表單資料
    const { name } = req.body
    // 取得在middleware/multer處理過放在req.file裡的圖片資料
    const { file } = req
    // 取得動態路由id
    const id = req.params.id

    // 判斷name是否有值，無回傳錯誤訊息
    if (!name) throw new Error('User name is required')

    return Promise.all([
      User.findByPk(id), // 查詢動態路由id的user資料
      imgurFileHandler(file) // 呼叫localFileHandler處理圖片檔案
    ])
      .then(([user, filePath]) => {
        // 判斷user是否有資料，無回傳錯誤訊息
        if (!user) throw new Error("User didn't exists!")

        // 更新資料庫資料
        return user.update({
          name,
          image: filePath || user.image // 如果filePath有值就更新成filePath， 若沒有值維特更新前的image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功') // 回傳成功訊息
        res.redirect(`/users/${id}`) // 重新導向該使用者profile頁面
      })
      .catch(err => next(err))
  },

  // 新增favorite
  addFavorite: (req, res, next) => {
    // 取得動態路由restaurantId
    const { restaurantId } = req.params

    return Promise.all([
      Restaurant.findByPk(restaurantId), // 查詢動態路由餐廳資料
      Favorite.findOne({ // 查詢是否有favorite資料
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        // 判斷資料是否已在，若不是回傳錯誤訊息
        if (!restaurant) throw new Error("Restaurant didn't exists!")
        if (favorite) throw new Error('You have favorited this restaurant!')

        // 新增至資料庫
        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back')) // 重新導向上一頁
      .catch(err => next(err))
  },

  removeFavorite: (req, res, next) => {
    // 取得動態路由restaurantId
    const { restaurantId } = req.params

    return Favorite.findOne({ // 查詢是否有favorite資料
      where: {
        userId: req.user.id,
        restaurantId
      }
    })
      .then(favorite => {
        // 判斷資料是否已在，若不是回傳錯誤訊息
        if (!favorite) throw new Error("You haven't favorited this restaurant!")

        // 刪除資料庫
        return favorite.destroy()
      })
      .then(() => res.redirect('back')) // 重新導向上一頁
      .catch(err => next(err))
  },

  // 新增like
  addLike: (req, res, next) => {
    const { restaurantId } = req.params // 取得動態餐廳id

    return Promise.all([
      Restaurant.findByPk(restaurantId), // 查詢動態路由所指的restaurant資料
      Like.findOne({ // 查詢登入使用者是否有like指定餐廳
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        // 判斷資料是否已在，回傳錯誤訊息
        if (!restaurant) throw new Error("Restaurant didn't exists!")
        if (like) throw new Error('You have liked this restaurant!')

        // 新增至資料庫
        return Like.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back')) // 重新導向上一頁
      .catch(err => next(err))
  },

  // 刪除like
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params // 取得動態餐廳id

    return Like.findOne({ // 查詢動態路由所指的restaurant資料
      where: {
        userId: req.user.id,
        restaurantId
      }
    })
      .then(like => {
        // 判斷資料是否已在，若不是回傳錯誤訊息
        if (!like) throw new Error("You haven't liked this restaurant!")

        // 從資料庫刪除
        return like.destroy()
      })
      .then(() => res.redirect('back')) // 重新導向上一頁
      .catch(err => next(err))
  }
}

// 匯出模組
module.exports = userController
