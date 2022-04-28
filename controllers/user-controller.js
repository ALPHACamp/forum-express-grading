const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { Restaurant, Comment, User, Favorite } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
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
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: Restaurant }
      ]
    }).then(user => {
      if (!user) throw new Error("user didn't exist!")
      const restaurantList = user.Comments.map(comment => {
        return ({ name: comment.Restaurant.name, id: comment.Restaurant.id })
      })
      const restaurantListSet = [...new Set(restaurantList.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
      // console.log('restaurantListSet', restaurantListSet)
      // console.log('req.user.id', Number(req.user.id)) 即便找的到id，測試的時候仍會顯示 Cannot read property 'id' of undefined
      const id = Number(getUser(req).id)
      const email = getUser(req).email
      return res.render('users/profile', {
        user: user.toJSON(),
        id,
        email,
        restaurantCount: restaurantListSet.length,
        restaurantListSet
      })
    })
  },
  //   try {
  //     const user = await User.findByPk(req.params.id, {
  //       include: [
  //         { model: Comment, include: Restaurant }
  //       ]
  //     })
  //     if (!user) throw new Error("user didn't exist!")
  //     let restaurantName = []
  //     let restaurantId = []
  //     // console.log('user.Comments', user.Comments)
  //     // console.log('user.Comments[0]', user.Comments[0].Restaurant.id)
  //     // console.log('user.Comments[0]', user.Comments[0].Restaurant.name)
  //     // const restaurantList = user.Comments.map(comment => {
  //     //   return { name: comment.Restaurant.name, id: comment.Restaurant.id }
  //     // })
  //     user.Comments.forEach(comment => {
  //       restaurantName.push(comment.Restaurant.name)
  //       restaurantId.push(comment.Restaurant.id)
  //     })
  //     restaurantName = [...new Set(restaurantName)]
  //     restaurantId = [...new Set(restaurantId)]
  //     const restaurantList = restaurantName.map((item, index) => ({ name: item, id: restaurantId[index] }))
  //     return res.render('users/profile', {
  //       user: user.toJSON(),
  //       id: Number(req.user.id),
  //       email: req.user.email,
  //       restaurantCount: restaurantList.length,
  //       restaurantList
  //     })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("user doesn't exist!")
        // console.log(user)
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const { file } = req
    // console.log(req.user)
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
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
