const { User, Comment, Restaurant, Favorite, Followship, Like } = require('../models') // function named User
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
// const id = require('faker/lib/locales/id_ID')
const { Op, Sequelize } = require('sequelize')
// const { Sequelize, QueryTypes } = require('sequelize')
// const sequelize = new Sequelize('mysql://localhost:3306/?user=root&password=password&database=forum')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // (password, salt or salt rounds)
        // then 這邊有 return bcrypt.hash...執行的結果，後面用 then hash 承接，此種方法可以提高閱讀性，避免巢狀層級
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號 請重新登入!')
        res.redirect('/signin')
      })
      .catch(error => next(error)) // 前往 express 內建 error handler middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        return Comment.findAll({
          include: [
            { model: Restaurant, attributes: ['name', 'image'] }
          ],
          where: { userId: user.id, text: { [Op.not]: null } },
          // group: [['restaurantId']],
          // order: [['createdAt', 'DESC']],
          raw: true,
          nest: true,
          attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('restaurant_id')), 'restaurantId']
          ]
        })
          .then(comment => {
            res.render('users/profile', { comment, commentLen: comment.length, user })
          })
      })
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")

        res.render('users/edit', { user })
      })
      .catch(error => next(error))
  },
  putUser: (req, res, next) => {
    const id = Number(req.params.id)
    if (id !== req.user.id) throw new Error('No permission to edit')
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(req.file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        console.log(filePath)
        req.body.image = filePath || user.image
        return user.update({ ...req.body })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(error => next(error))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          restaurantId,
          userId: req.user.id
        }
      })
    ]).then(([restaurant, favorite]) => {
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (favorite) throw new Error('You have not favorited this restaurant!')

      return Favorite.create({
        userId: req.user.id,
        restaurantId
      })
        .then(() => res.redirect('back'))
        .catch(error => next(error))
    })
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    }).then(favorite => {
      if (!favorite) throw new Error("You haven't favorited this restaurant")

      return favorite.destroy()
    }).then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  getTopUsers: (req, res, next) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        // 整理 users 資料，把每個 user 項目都拿出來處理一次，並把新陣列儲存在 users 裡
        const result = users.map(user => ({
          // 整理格式
          ...user.toJSON(),
          // 計算追蹤者人數
          followerCount: user.Followers.length,
          // 判斷目前登入使用者是否已追蹤該 user 物件
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('top-users', { users: result })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({ where: { userId: req.user.id, restaurantId } })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')

        return Like.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  },
  removeLike: (req, res, next) => {
    console.log('\nreq.user:\n', req.user)
    const { restaurantId } = req.params
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error("you haven't liked this restaurant")

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(error => next(error))
  }
  // getUser: async (req, res, next) => {
  //   const [result] = await sequelize.query('SELECT * FROM users WHERE id = ?', {
  //     replacements: [req.params.id],
  //     type: QueryTypes.SELECT
  //   })
  //   console.log(result)
  // }
}

module.exports = userController
