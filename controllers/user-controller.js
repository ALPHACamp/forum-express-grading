const bcrypt = require('bcryptjs') // 載入 bcrypt
const { User, Comment, Restaurant, Favorite, Like } = require('../models')
const Sequelize = require('sequelize')

const { getUser } = require('../helpers/auth-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    // 取得錯誤處理當下所發出的 form body
    const body = req.flash('body')
    const bodyParse = body.length ? JSON.parse(body) : ''
    res.render('signup', { ...bodyParse })
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    // 如果兩次輸入的密碼不同，丟出 Error
    if (password !== passwordCheck) throw new Error('密碼不正確')

    // 確認使用者是否註冊
    User.findOne({ where: { email } })
      .then(user => {
        // 已註冊就拋出 Error
        if (user) throw new Error('Email 已註冊過')
        // 正常註冊程序
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號')
        res.redirect('/signin')
      })
      // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    // 取得錯誤處理當下所發出的 form body
    const body = req.flash('body')
    const bodyParse = body.length ? JSON.parse(body) : ''
    res.render('signin', { ...bodyParse })
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res, next) => {
    const userId = req.params.id

    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Comment.findAndCountAll({
        where: {
          id: {
            // 取得排列後的 id 順序 ， 此版本不支援 subquery 使用 IN,LIMIT，因此再外加一層
            [Sequelize.Op.in]: Sequelize.literal(`(
              SELECT orderedComment.id
              FROM ( 
                SELECT Comment.id
                FROM Comments AS Comment
                WHERE Comment.user_id="${userId}"
                ORDER BY Comment.created_at DESC
                LIMIT 9999999
              ) AS orderedComment
            )`)
          }
        },
        include: Restaurant,
        group: ['restaurant_id'],
        raw: true,
        nest: true
      })
    ])
      .then(([user, comments]) => {
        if (!user) throw new Error('使用者不存在')
        //  Whether user is self
        user.self = user.id === getUser(req).id

        // calculate comment count
        const commentCounts = comments.count.reduce((accumulator, currentRest) => accumulator + currentRest.count, 0)

        res.render('users/profile', { user, filteredComments: comments.rows, commentCounts })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const id = Number(req.params.id)
    //  Whether user is self
    if (id !== getUser(req).id) throw new Error('無法編輯其他使用者')
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('使用者不存在')

        res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const id = Number(req.params.id)
    const name = req.body?.name?.trim() || ''
    const { file } = req // 把檔案取出來
    if (!name) throw new Error('請輸入名稱')
    //  Whether user is self
    if (id !== getUser(req).id) throw new Error('無法編輯其他使用者')

    return Promise.all([User.findByPk(id), imgurFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error('使用者不存在')
        return user.update({ name, image: file ? filePath : user.image })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const userId = getUser(req).id
    const { restaurantId } = req.params
    return Promise.all([Restaurant.findByPk(restaurantId), Favorite.findOne({ where: { userId, restaurantId } })])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('餐廳不存在')
        if (favorite) throw new Error('餐廳已經收藏過')
        return Favorite.create({ userId, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const userId = getUser(req).id
    return Favorite.findOne({
      where: { userId, restaurantId: req.params.restaurantId }
    })
      .then(favorite => {
        if (!favorite) throw new Error('餐廳沒有收藏過')
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const userId = getUser(req).id
    const { restaurantId } = req.params
    return Promise.all([Restaurant.findByPk(restaurantId), Like.findOne({ where: { userId, restaurantId } })])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('餐廳不存在')
        if (like) throw new Error('餐廳已經按讚過')
        return Like.create({ userId, restaurantId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const userId = getUser(req).id
    return Like.findOne({
      where: { userId, restaurantId: req.params.restaurantId }
    })
      .then(like => {
        if (!like) throw new Error('餐廳沒有按讚過')
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
