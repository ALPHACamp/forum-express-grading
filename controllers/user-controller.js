const bcrypt = require('bcryptjs') // 載入 bcrypt
const { User, Comment, Restaurant, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    try {
      // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
      if (password !== passwordCheck) {
        throw new Error('Passwords do not match!')
      }
      // 確認 email 是否已註冊，如有就建立一個 Error 物件並拋出
      const user = await User.findOne({ where: { email } })

      if (user) {
        throw new Error('Email already exists!')
      }

      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash
      })
      req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
      res.redirect('/signin')
    } catch (e) {
      next(e)
    } // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: {
        model: Comment,
        include: Restaurant
      },
      nest: true
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist.")
        const commentRestaurant = user.Comments
          ? user.Comments.map(comment => comment.Restaurant.dataValues)
          : 0
        // 可以直接回傳user.toJSON()再透過user.Comments>取出this.Restaurant.id/image
        return res.render('users/profile', {
          user: user.toJSON(),
          commentRestaurant
        })
      })
      .catch(e => next(e))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist.")
        return res.render('users/edit', { user })
      })
      .catch(e => next(e))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('Name is required!')
    return Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist.")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(user => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.params.id}`)
      })
      .catch(e => next(e))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({ where: { userId, restaurantId } })])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')
        return Favorite.create({ restaurantId, userId })
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  },
  removeFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id

    return Favorite.findOne({ where: { userId, restaurantId } })
      .then(favorite => {
        if (!favorite) { throw new Error("You haven't favorited this restaurant!") }

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(e => next(e))
  }
}

module.exports = userController
