const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (passwordCheck !== password) {
      req.flash('error_msg', '密碼與確認密碼不相符！')
      return res.redirect('/signup')
    } else {
      User.findOne({
        where: { email }
      })
        .then(user => {
          if (user) {
            req.flash('error_msg', '此信箱已註冊！')
            return res.redirect('/signup')
          }
        })
    }

    User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    })
      .then(user => {
        req.flash('success_msg', '成功註冊帳號！')
        return res.render('signin')
      })
      .catch(err => console.log(err))
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msg', '登入成功！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_msg', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        Comment.findAndCountAll({
          raw: true, nest: true,
          where: { userId: Number(req.params.id) },
          include: Restaurant
        })
          .then(comments => {
            return res.render('profile', {
              userProfile: user.toJSON(),
              count: comments.count,
              comments: comments.rows
            })
          })

      })
      .catch(err => console.log(err))
  },

  editUser: (req, res) => {
    const currentUserId = helpers.getUser(req).id
    return User.findByPk(req.params.id)
      .then(user => {
        // you can only see the edit page of your own profile 
        if (currentUserId !== Number(req.params.id)) {
          req.flash('error_msg', '使用者只能編輯自己的個人資料')
          return res.redirect(`/users/${currentUserId}/edit`)
        }

        return res.render('editProfile', { userProfile: user.toJSON() })
      })
      .catch(err => console.log(err))
  },

  putUser: (req, res) => {
    const { name } = req.body
    const id = req.params.id
    const file = req.file

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then(user => {
            user.update({
              name,
              avatar: file ? img.data.link : user.avatar
            })
              .then(user => {
                req.flash('success_msg', '成功編輯使用者資訊！')
                return res.redirect(`/users/${id}`)
              })
          })
      })
    } else {
      return User.findByPk(id)
        .then(user => {
          user.update({
            name, avatar: user.avatar
          })
            .then(user => {
              req.flash('success_msg', '成功編輯使用者資訊！')
              return res.redirect(`/users/${id}`)
            })
        })
        .catch(err => console.log(err))
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then(restaurant => {
        return res.redirect('back')
      })
      .catch(err => console.log(err))
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        favorite.destroy()
          .then(restaurant => {
            return res.redirect('back')
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  },

  Like: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then(restaurant => {
        return res.redirect('back')
      })
      .catch(err => console.log(err))
  },

  Unlike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            return res.redirect('back')
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  },

  getTopUser: (req, res) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      // 整理 users 資料
      users = users.map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
      .catch(err => console.log(err))
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
}

module.exports = userController