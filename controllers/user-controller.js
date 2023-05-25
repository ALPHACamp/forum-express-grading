const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  // 使用者註冊頁面
  signUpPage: (req, res) => {
    res.render('signup')
  },
  // 使用者註冊功能
  signUp: async (req, res, next) => {
    // 若前後密碼不一致
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    try {
      const findUser = await User.findOne({ where: { email: req.body.email } })
      // 若Email已註冊
      if (findUser) throw new Error('Email already exists!')

      const passwordHash = await bcrypt.hash(req.body.password, 12)
      const createUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash
      })
      if (createUser) {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      }
    } catch (err) {
      next(err)
    }
  },
  // 使用者登入頁面
  signInPage: (req, res) => {
    res.render('signin')
  },
  // 使用者登入功能
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    // // 判斷是否具備管理者權限：是→後台首頁、否→前台首頁
    // if (req.user.dataValues.isAdmin) {
    //   res.redirect('/admin/restaurants')
    // } else {
    //   res.redirect('/restaurants')
    // }
    res.redirect('/restaurants')
  },
  // 使用者登出功能
  signout: (req, res) => {
    req.logout()
    req.flash('success_messages', '登出成功！')
    res.redirect('/signin')
  },
  // 使用者個人頁面
  getUser: async (req, res, next) => {
    const { id } = req.params // string
    const userId = req.user?.id || id // number
    try {
      const user = await User.findByPk(id, {
        raw: true,
        nest: true
      })
      if (!user) throw new Error("User didn't exist!")
      const comments = await Comment.findAndCountAll({
        raw: true,
        nest: true,
        where: { userId: id },
        include: Restaurant
      })
      return res.render('users/profile', { user, userId, comments })
    } catch (e) {
      next(e)
    }
  },
  // 編輯使用者個人資料頁面
  editUser: async (req, res, next) => {
    const { id } = req.params // string
    const userId = req.user?.id || id // number
    if (Number(id) !== userId) {
      req.flash('error_messages', "Not allow to edit other's profile")
      return res.redirect(`/users/${id}`)
    }
    try {
      const user = await User.findByPk(id, { raw: true, nest: true })
      if (!user) throw new Error("User didn't exist!")
      return res.render('users/edit', { user })
    } catch (e) {
      next(e)
    }
  },
  // 修改使用者資料
  putUser: async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    try {
      const [user, filePath] = await Promise.all([User.findByPk(id), imgurFileHandler(file)])
      if (!user) throw new Error("User didn't exist.")

      await user.update({ name, image: filePath || user.image })
      req.flash('success_messages', '使用者資料編輯成功')

      return res.redirect(`/users/${user.id}`)
    } catch (e) {
      next(e)
    }
  },
  // 使用者收藏餐廳
  addFavorite: async (req, res, next) => {
    const { restaurantId } = req.params
    try {
      const restaurant = await Restaurant.findByPk(restaurantId)
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      const favorite = await Favorite.findOne({ where: { userId: req.user.id, restaurantId } })
      if (favorite) throw new Error('You have favorited this restaurant!')
      await Favorite.create({ userId: req.user.id, restaurantId })
      return res.redirect('back')
    } catch (e) {
      next(e)
    }
  },
  // 使用者移除收藏餐廳
  removeFavorite: async (req, res, next) => {
    try {
      const favorite = await Favorite.findOne({ where: { userId: req.user.id, restaurantId: req.params.restaurantId } })
      if (!favorite) throw new Error("You haven't favorited this restaurant")
      await favorite.destroy()
      return res.redirect('back')
    } catch (e) {
      next(e)
    }
  }
}

module.exports = userController
