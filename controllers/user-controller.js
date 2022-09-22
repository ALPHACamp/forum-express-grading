const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getUser } = require('./../helpers/auth-helpers')

exports.signUpPage = (req, res, next) => {
  res.render('signup')
}

exports.signUp = async (req, res, next) => {
  try {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords not match!')

    const user = await User.findOne({ where: { email: req.body.email } })
    if (user) throw new Error('Email exists already')

    const hash = await bcrypt.hash(req.body.password, 10)
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash
    })
    req.flash('success_messages', '成功註冊帳戶！')
    return res.redirect('/signin')
  } catch (err) {
    next(err)
  }
}

exports.signInPage = (req, res, next) => {
  res.render('signin')
}

exports.signIn = (req, res, next) => {
  req.flash('success_messages', '成功登入')
  res.redirect('/restaurants')
}

exports.logout = (req, res, next) => {
  req.flash('success_messages', '成功登出')
  req.logout()
  res.redirect('/signin')
}

exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findByPk(userId, {
      include: [{ model: Comment, include: Restaurant }]
    })
    if (!user) throw new Error('User not found!')
    const userJSON = user.toJSON()
    const userData = { ...userJSON, isUser: +userId === getUser(req).id }
    return res.render('users/profile', { user: userData })
  } catch (err) {
    next(err)
  }
}

exports.editUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findByPk(userId)
    if (!user) throw new Error('User not found!')
    const userJSON = user.toJSON()
    return res.render('users/edit', { user: userJSON })
  } catch (err) {
    next(err)
  }
}

exports.putUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findByPk(userId)
    if (!user) throw new Error('User not found!')

    const { name } = req.body
    if (!name) throw new Error('名稱為必填欄位')

    const { file } = req
    const filePath = await imgurFileHandler(file)
    await user.update({
      name: req.body.name,
      image: filePath || null
    })
    req.flash('success_messages', '使用者資料編輯成功')
    return res.redirect(`/users/${user.id}`)
  } catch (err) {
    next(err)
  }
}

exports.addFavorite = async (req, res, next) => {
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
    if (!restaurant) throw new Error('Restaurant not found')
    if (favorite) throw new Error('已經加入最愛')

    await Favorite.create({
      userId: req.user.id,
      restaurantId
    })
    return res.redirect('back')
  } catch (err) {
    next(err)
  }
}

exports.removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
    if (!favorite) throw new Error("You havn't favorited this restaurant")

    await favorite.destroy()
    return res.redirect('back')
  } catch (err) {
    next(err)
  }
}

exports.addLike = async (req, res, next) => {
  try {
    console.log('addLike:', req.user)
    const { restaurantId } = req.params
    const promises = Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
    const [restaurant, like] = await promises
    if (!restaurant) throw new Error('Restaurant not found')
    if (like) throw new Error('已經 like 過')

    await Like.create({
      userId: req.user.id,
      restaurantId
    })
    return res.redirect('back')
  } catch (err) {
    next(err)
  }
}

exports.removeLike = async (req, res, next) => {
  try {
    const like = await Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
    if (!like) throw new Error("You havn't favorited this restaurant")

    await like.destroy()
    return res.redirect('back')
  } catch (err) {
    next(err)
  }
}

exports.getTopUsers = async (req, res, next) => {
  try {
    let users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
    users = users.map(user => ({
      ...user.toJSON(),
      followerCount: user.Followers.length,
      isFollowed: req.user.Followings.some(({ id }) => user.id === id)
    }))
    return res.render('top-users', { users })
  } catch (err) {
    next(err)
  }
}

exports.addFollowing = async (req, res, next) => {
  try {
    const [user, followship] = await Promise.all([
      User.findByPk(req.params.userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
    ])
    if (!user) throw new Error('User not found')
    if (followship) throw new Error("You've followed this user")

    await Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
    return res.redirect('back')
  } catch (err) {
    next(err)
  }
}

exports.removeFollowing = async (req, res, next) => {
  try {
    const followship = await Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })

    if (!followship) throw new Error("You haven't followed this user!")
    await followship.destroy()
    return res.redirect('back')
  } catch (err) {
    next(err)
  }
}
