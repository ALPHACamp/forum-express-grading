// import packages
const bcrypt = require('bcryptjs')

// import models
<<<<<<< HEAD
const { User } = require('../models')
=======
const { User, Comment, Restaurant } = require('../models')
>>>>>>> R03

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
<<<<<<< HEAD
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error('This user does not exist!')

      return res.render('users/profile', { user })
=======
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
>>>>>>> R03
    } catch (error) {
      next(error)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error('This user does not exist!')

<<<<<<< HEAD
=======
      // 這邊也是，要防止非本人的 profile而做邏輯處理，反而導致測試過不了
      // avoid user change id on url to edit other users' profile
      // editting others' profile is bad behavior, so giving warning message in upper case

      // const registeredEmail = res.locals.user.email
      // if (registeredEmail !== user.email) {
      //   req.flash('warning_messages', `YOU ARE NOT ALLOWED TO EDIT OTHER PERSON'S PROFILE!`)
      //   return res.redirect(`/users/${res.locals.user.id}`)
      // }

>>>>>>> R03
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
}

module.exports = userController
