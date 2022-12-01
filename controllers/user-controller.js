const bcrypt = require('bcryptjs')
const { User, Restaurant, Comment, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => { // 修改這裡
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return
      })
      .then(hash => User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  }, // 新增以下程式碼
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [{
        model: Comment, include: Restaurant
      }]
    })
      .then(user => {
        user = user.toJSON()
        // 找出評論過且不重複的餐廳
        user.commentedRestaurants = user.Comments && user.Comments.reduce((acc, comment) => {
          if (!acc.some(restaurant => restaurant.id === comment.restaurantId)) acc.push(comment.Restaurant)
          return acc
        }, [])
        if (!user) throw new Error("User didn't exist!")
        
        return res.render('users/profile', { user })
      })
      .catch(next)
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error("User didn't exist")
        return res.render('users/edit', { user: user.toJSON() })
      })
      .catch(next)
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    const { id } = req.params
    if (req.user.id !== Number(id)) throw new Error('無法修改此使用者資料')
    if (!name.trim()) throw new Error('Name is required!')
    return Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])
      .then(([userData, filePath]) => {
        if (!userData) throw new Error("用戶不存在")
        return userData.update({
          name,
          image: filePath || userData.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(next)
  }, // 補逗點，新增以下
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = userController
