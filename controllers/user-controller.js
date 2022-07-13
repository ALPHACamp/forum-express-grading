const bcrypt = require('bcryptjs') // 載入 bcrypt
const { User, Comment, Restaurant, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
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
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('warning_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => { // go to Profile page
    try {
      const user = await User.findByPk(req.params.user_id,
        {
          include: [
            { model: Comment, include: [Restaurant] }
          ],
          nest: true
        }
      )
      if (!user) throw new Error("User didn't exist!") // didnot find a user

      return res.render('users/profile',
        { user: user.toJSON() }
      )
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => { // go to Profile edit page
    try {
      const user = await User.findByPk(req.params.user_id)
      res.render('users/edit', { user: user.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => { // update Profile
    try {
      const name = req.body.name
      const { file } = req // = const file = req.file

      const [user, filePath] = await Promise.all(
        [
          User.findByPk(req.params.user_id),
          imgurFileHandler(file)
        ]
      )

      await user.update(
        {
          name,
          image: filePath || user.image
        }
      )
      req.flash('success_messages', '使用者資料編輯成功')
      res.redirect(`/users/${user.id}`)
    } catch (error) {
      next(error)
    }
  },
  addFavorite: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, favorite] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Favorite.findOne({
          where: {
            userId: req.user.id,
            restaurantId
          }
        })
      ])

      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (favorite) throw new Error('You have favorited this restaurant!')

      await Favorite.create({
        userId: req.user.id,
        restaurantId
      })
      req.flash('success_messages', 'addFavorite successfully')
      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId
        }
      })
      if (!favorite) throw new Error("You haven't favorited this restaurant")

      await favorite.destroy()
      req.flash('error_messages', 'removeFavorite successfully')

      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
