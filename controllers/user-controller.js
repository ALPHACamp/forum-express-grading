// import packages
const bcrypt = require('bcryptjs')

// import models
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')

// import helper
const { imgurFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) throw new Error(`password and passwordCheck don't match!`)

    User.findOne({ where: { email } })
      .then((user) => {
        if (user) throw new Error(`This email has been register! Please use another one.`)

        // throw out async event & make .then at same level
        // return 'hash' to next .then
        return bcrypt.hash(password, 10)
      })
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash,
        })
      )
      .then(() => {
        req.flash('success_messages', 'Successfully sign up! Now you are able to use this website.')
        res.redirect('/signin')
      })
      .catch((error) => next(error))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Successfully sign in!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Successfully log out!')
    // log out = server will clear session
    req.logout(() => {
      res.redirect('/signin')
    })
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { nest: true, include: { model: Comment, include: Restaurant } })
      if (!user) throw new Error('This user does not exist!')

      return res.render('users/profile', { user: user.toJSON(), comments: user.toJSON().Comments })

      // 本來想把資料都處理好再送到前端，但處理好再傳出去就變成測試過不了（無奈攤手
      // comments: array of object [{}, {}, ..., {}]
      // const comments = user.Comments
      // restaurants: array of object [{}, {}, ..., {}]
      // const restaurants = await Promise.all(
      //   comments.map(async (comment) => {
      //     return await comment.Restaurant
      //   })
      // )
      // return res.render('users/profile', { user, comments, restaurants })
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error('This user does not exist!')

      // 這邊也是，要防止非本人的 profile而做邏輯處理，反而導致測試過不了
      // avoid user change id on url to edit other users' profile
      // editting others' profile is bad behavior, so giving warning message in upper case

      // const registeredEmail = res.locals.user.email
      // if (registeredEmail !== user.email) {
      //   req.flash('warning_messages', `YOU ARE NOT ALLOWED TO EDIT OTHER PERSON'S PROFILE!`)
      //   return res.redirect(`/users/${res.locals.user.id}`)
      // }

      return res.render('users/edit', { user })
    } catch (error) {
      next(error)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { name } = req.body
      const userId = req.params.id
      if (!name) throw new Error('Name is the required field!')

      const { file } = req
      const [user, filePath] = await Promise.all([User.findByPk(userId), imgurFileHandler(file)])
      if (!user) throw new Error('This user does not exist!')

      await user.update({ name, image: filePath || user.image })
      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${userId}`)
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
            restaurantId,
          },
        }),
      ])

      if (!restaurant) throw new Error('This restaurant does not exist!')
      if (favorite) throw new Error('You have favorited this restaurant!')

      await Favorite.create({ userId: req.user.id, restaurantId })

      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  removeFavorite: async (req, res, next) => {
    try {
      // improve function:
      // find restaurant to get resName
      const favorite = await Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId,
        },
      })

      if (!favorite) throw new Error(`You haven't favorited this restaurant!`)
      await favorite.destroy()

      req.flash('success_messages', 'Successfully remove the restaurant from your favorite!')
      // req.flash('success_messages', `Successfully remove restaurant ${resName} from your favorite!`)
      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const { restaurantId } = req.params
      const [restaurant, like] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        Like.findOne({
          where: {
            userId: req.user.id,
            restaurantId,
          },
        }),
      ])

      if (!restaurant) throw new Error('This restaurant does not exist!')
      if (like) throw new Error('You have liked this restaurant!')

      await Like.create({ userId: req.user.id, restaurantId })

      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId: req.params.restaurantId,
        },
      })

      if (!like) throw new Error(`You haven't liked this restaurant!`)
      await like.destroy()

      req.flash('success_messages', 'Successfully remove the restaurant from your like list!')
      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const theSignInUser = req.user
      const users = await User.findAll({
        include: [{ model: User, as: 'Followers' }],
      })
      const result = users
        .map((user) => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          // 判斷目前登入使用者是否已追蹤美食達人 user 物件
          isFollowed: theSignInUser.Followings.some((f) => f.id === user.id),
        }))
        .sort((a, b) => b.followerCount - a.followerCount)

      return res.render('top-users', { users: result })
    } catch (error) {
      next(error)
    }
  },
  addFollowing: async (req, res, next) => {
    try {
      const theSignInUser = req.user
      const { userId } = req.params
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: theSignInUser.id,
            followingId: userId,
          },
        }),
      ])

      if (!user) throw new Error('This user does not exist!')
      if (followship) throw new Error('You are following this user!')

      await Followship.create({
        followerId: theSignInUser.id,
        followingId: userId,
      })

      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const theSignInUser = req.user
      const followship = await Followship.findOne({
        where: {
          followerId: theSignInUser.id,
          followingId: req.params.userId,
        },
      })

      if (!followship) throw new Error(`You haven't followed this user!`)

      await followship.destroy()

      return res.redirect('back')
    } catch (error) {
      next(error)
    }
  },
}

module.exports = userController
